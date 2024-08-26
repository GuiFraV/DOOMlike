import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DoorObject } from "../types/game";
import InteractionMessage from "./InteractionMessage";

interface PlayerProps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  walls: THREE.Object3D[];
  doors: DoorObject[];
}

const DOOR_WIDTH = 4;

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
  const animationIdRef = useRef<number | null>(null); // Ref pour stocker l'ID de l'animation
  const mouseStateRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!scene || !camera) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyZ":
          moveStateRef.current.forward = true;
          break;
        case "KeyS":
          moveStateRef.current.backward = true;
          break;
        case "KeyQ":
          moveStateRef.current.left = true;
          break;
        case "KeyD":
          moveStateRef.current.right = true;
          break;
        case "Enter":
          moveStateRef.current.interact = true;
          break;
      }
      console.log("KeyDown:", event.code, moveStateRef.current);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyZ":
          moveStateRef.current.forward = false;
          break;
        case "KeyS":
          moveStateRef.current.backward = false;
          break;
        case "KeyQ":
          moveStateRef.current.left = false;
          break;
        case "KeyD":
          moveStateRef.current.right = false;
          break;
        case "Enter":
          moveStateRef.current.interact = false;
          break;
      }
      console.log("KeyUp:", event.code, moveStateRef.current);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseStateRef.current.x += event.movementX;
      mouseStateRef.current.y += event.movementY;
      console.log("MouseMove:", mouseStateRef.current);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);

    // Réduire la vitesse de déplacement et de rotation
    const speed = 0.05; // Vitesse de déplacement réduite
    const rotationSpeed = 0.002; // Vitesse de rotation réduite
    const collisionDistance = 0.5;
    const pushbackDistance = 0.1;
    const interactionDistance = 2;

    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();

    const toggleDoor = (door: DoorObject) => {
      if (animatingDoorsRef.current.has(door)) return;

      const isHorizontal = door.scale.x > door.scale.z;
      const openPosition = isHorizontal ? DOOR_WIDTH / 2 : DOOR_WIDTH / 2;
      const closedPosition = 0;
      const targetPosition = door.isOpen ? closedPosition : openPosition;
      const duration = 1000; // Animation duration in milliseconds
      const startPosition = isHorizontal ? door.position.x : door.position.z;
      const startTime = Date.now();

      animatingDoorsRef.current.add(door);

      const animateDoor = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const newPosition =
          startPosition + (targetPosition - startPosition) * progress;

        if (isHorizontal) {
          door.position.setX(newPosition);
        } else {
          door.position.setZ(newPosition);
        }

        if (progress < 1) {
          requestAnimationFrame(animateDoor);
        } else {
          door.isOpen = !door.isOpen;
          animatingDoorsRef.current.delete(door);
        }
      };

      animateDoor();
    };

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotation
      camera.rotation.y -= mouseStateRef.current.x * rotationSpeed;
      camera.rotation.x -= mouseStateRef.current.y * rotationSpeed;
      mouseStateRef.current.x = 0;
      mouseStateRef.current.y = 0;

      // Movement
      direction.set(0, 0, 0);
      if (moveStateRef.current.forward) {
        direction.z = -1;
      } else if (moveStateRef.current.backward) {
        direction.z = 1;
      }
      if (moveStateRef.current.left) {
        direction.x = -1;
      } else if (moveStateRef.current.right) {
        direction.x = 1;
      }

      console.log("Direction before applyQuaternion:", direction);

      if (direction.length() > 0) {
        direction.applyQuaternion(camera.quaternion);
        direction.y = 0; // Keep movement in the xz plane
        direction.normalize();

        console.log("Direction after applyQuaternion:", direction);

        raycaster.set(camera.position, direction);
        const intersections = raycaster.intersectObjects([
          ...walls,
          ...doors.filter((door) => !door.isOpen),
        ]);

        if (
          intersections.length === 0 ||
          intersections[0].distance > collisionDistance
        ) {
          camera.position.addScaledVector(direction, speed);
        } else {
          // Pushback on collision
          const pushbackDirection = direction.clone().negate();
          camera.position.addScaledVector(pushbackDirection, pushbackDistance);
        }
      }

      // Door interaction check
      raycaster.set(
        camera.position,
        camera.getWorldDirection(new THREE.Vector3())
      );
      const doorIntersections = raycaster.intersectObjects(doors);
      setShowInteractionMessage(
        doorIntersections.length > 0 &&
          doorIntersections[0].distance < interactionDistance
      );

      // Door interaction
      if (moveStateRef.current.interact && showInteractionMessage) {
        const door = doorIntersections[0].object as DoorObject;
        toggleDoor(door);
        moveStateRef.current.interact = false; // Reset interaction state
      }
    };

    animate();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current); // Annuler l'animation en cours
      }
    };
  }, [scene, camera, walls, doors, showInteractionMessage]);

  return <InteractionMessage show={showInteractionMessage} />;
};

export default Player;
