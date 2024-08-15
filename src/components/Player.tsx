import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface PlayerProps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

const Player: React.FC<PlayerProps> = ({ scene, camera }) => {
  const moveStateRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    if (!scene || !camera) return;

    const onKeyDown = (event: KeyboardEvent) => {
      console.log("Key down:", event.code); // Debug log
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
      console.log("Move state:", moveStateRef.current); // Debug log
    };

    const onKeyUp = (event: KeyboardEvent) => {
      console.log("Key up:", event.code); // Debug log
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
      console.log("Move state:", moveStateRef.current); // Debug log
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    const speed = 0.1;
    const rotationSpeed = 0.05;

    const animate = () => {
      requestAnimationFrame(animate);

      if (moveStateRef.current.forward) {
        camera.translateZ(-speed);
        console.log("Moving forward"); // Debug log
      }
      if (moveStateRef.current.backward) {
        camera.translateZ(speed);
        console.log("Moving backward"); // Debug log
      }
      if (moveStateRef.current.left) {
        camera.rotateY(rotationSpeed);
        console.log("Rotating left"); // Debug log
      }
      if (moveStateRef.current.right) {
        camera.rotateY(-rotationSpeed);
        console.log("Rotating right"); // Debug log
      }
    };

    animate();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [scene, camera]);

  return null;
};

export default Player;
