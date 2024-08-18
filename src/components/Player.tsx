import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface PlayerProps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  walls: THREE.Mesh[];
}

const Player: React.FC<PlayerProps> = ({ scene, camera, walls }) => {
  const moveStateRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    if (!scene || !camera) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowUp":
          moveStateRef.current.forward = true;
          break;
        case "ArrowDown":
          moveStateRef.current.backward = true;
          break;
        case "ArrowLeft":
          moveStateRef.current.left = true;
          break;
        case "ArrowRight":
          moveStateRef.current.right = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowUp":
          moveStateRef.current.forward = false;
          break;
        case "ArrowDown":
          moveStateRef.current.backward = false;
          break;
        case "ArrowLeft":
          moveStateRef.current.left = false;
          break;
        case "ArrowRight":
          moveStateRef.current.right = false;
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const speed = 0.1;
    const rotationSpeed = 0.05;

    const playerRadius = 0.5; // Rayon du joueur pour la collision

    const checkCollision = (newPosition: THREE.Vector3) => {
      for (const wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        const playerSphere = new THREE.Sphere(newPosition, playerRadius);
        if (wallBox.intersectsSphere(playerSphere)) {
          return true; // Collision détectée
        }
      }
      return false; // Pas de collision
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const newPosition = camera.position.clone();

      if (moveStateRef.current.forward) {
        camera.translateZ(-speed);
        if (checkCollision(camera.position)) {
          camera.position.copy(newPosition);
        }
      }
      if (moveStateRef.current.backward) {
        camera.translateZ(speed);
        if (checkCollision(camera.position)) {
          camera.position.copy(newPosition);
        }
      }
      if (moveStateRef.current.left) {
        camera.rotateY(rotationSpeed);
      }
      if (moveStateRef.current.right) {
        camera.rotateY(-rotationSpeed);
      }
    };

    animate();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [scene, camera, walls]);

  return null;
};

export default Player;
