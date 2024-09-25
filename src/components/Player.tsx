import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { DoorObject } from "../types/game";
import InteractionMessage from "./InteractionMessage";
import TestPointerLock from "./TestPointerLock";

interface PlayerProps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  walls: THREE.Object3D[];
  doors: DoorObject[];
}

const WALL_HEIGHT = 3;

const Player: React.FC<PlayerProps> = ({ scene, camera, walls, doors }) => {
  const [showInteractionMessage, setShowInteractionMessage] = useState(false);
  const moveStateRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    interact: false,
  });
  const animatingDoorsRef = useRef<Set<DoorObject>>(new Set());
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);

  useEffect(() => {
    if (!scene || !camera) return;

    // Initialisation de PointerLockControls
    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;
    scene.add(controls.getObject());

    // Événement pour verrouiller le pointeur lorsque l'utilisateur clique
    const onClick = () => {
      controls.lock();
    };

    document.addEventListener("click", onClick);

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "z":
          moveStateRef.current.forward = true;
          break;
        case "s":
          moveStateRef.current.backward = true;
          break;
        case "q":
          moveStateRef.current.left = true;
          break;
        case "d":
          moveStateRef.current.right = true;
          break;
        case "enter":
          moveStateRef.current.interact = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "z":
          moveStateRef.current.forward = false;
          break;
        case "s":
          moveStateRef.current.backward = false;
          break;
        case "q":
          moveStateRef.current.left = false;
          break;
        case "d":
          moveStateRef.current.right = false;
          break;
        case "enter":
          moveStateRef.current.interact = false;
          break;
      }
    };

    // Ajout des écouteurs sur document au lieu de window
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    const speed = 0.1; // Vitesse ajustée pour un mouvement fluide
    const collisionDistance = 0.5;
    const interactionDistance = 2;

    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();

    const toggleDoor = (door: DoorObject) => {
      if (animatingDoorsRef.current.has(door)) return;

      animatingDoorsRef.current.add(door);

      const isOpening = !door.isOpen;
      const duration = 1000; // Durée de l'animation en millisecondes
      const startTime = Date.now();

      const animateDoor = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        if (isOpening) {
          // Ouverture
          door.pivot.rotation.y = progress * (Math.PI / 2);
        } else {
          // Fermeture
          door.pivot.rotation.y = (1 - progress) * (Math.PI / 2);
        }

        if (progress < 1) {
          requestAnimationFrame(animateDoor);
        } else {
          door.isOpen = isOpening;
          animatingDoorsRef.current.delete(door);
        }
      };

      animateDoor();
    };

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const controls = controlsRef.current;
      if (!controls) return;

      // Mouvement
      direction.set(0, 0, 0);
      if (moveStateRef.current.forward) direction.z += 1;
      if (moveStateRef.current.backward) direction.z -= 1;
      if (moveStateRef.current.left) direction.x -= 1;
      if (moveStateRef.current.right) direction.x += 1;

      if (direction.length() > 0) {
        direction.normalize();
        const deltaX = direction.x * speed;
        const deltaZ = direction.z * speed;

        // Vérification des collisions avant de déplacer le joueur
        const nextPosition = controls.getObject().position.clone();
        nextPosition.x += deltaX;
        nextPosition.z += deltaZ;

        const collision = walls.some((wall) => {
          const wallBox = new THREE.Box3().setFromObject(wall);
          const playerBox = new THREE.Box3().setFromCenterAndSize(
            nextPosition,
            new THREE.Vector3(1, WALL_HEIGHT, 1) // Taille approximative du joueur
          );
          return wallBox.intersectsBox(playerBox);
        });

        if (!collision) {
          controls.moveRight(deltaX);
          controls.moveForward(deltaZ);
        }
      }

      // Vérification de l'interaction avec les portes
      raycaster.set(
        controls.getObject().position,
        controls.getDirection(new THREE.Vector3())
      );

      // Intersection avec les portes (en vérifiant les enfants du pivot)
      const doorIntersections = raycaster.intersectObjects(
        doors.map((door) => door.pivot.children[0]),
        false
      );

      setShowInteractionMessage(
        doorIntersections.length > 0 &&
          doorIntersections[0].distance < interactionDistance
      );

      // Interaction avec les portes
      if (moveStateRef.current.interact && showInteractionMessage) {
        const doorMesh = doorIntersections[0].object as THREE.Mesh;
        const door = doors.find((d) => d.pivot.children[0] === doorMesh);
        if (door) {
          toggleDoor(door);
        }
        moveStateRef.current.interact = false; // Réinitialiser l'état d'interaction
      }
    };

    animate();
    <TestPointerLock />;
    return () => {
      // Retirez les écouteurs sur document
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("click", onClick);
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      controls.disconnect();
      scene.remove(controls.getObject());
    };
  }, [scene, camera, walls, doors]);

  return <InteractionMessage show={showInteractionMessage} />;
};

export default Player;
