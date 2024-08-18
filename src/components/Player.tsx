import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface PlayerProps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  walls: THREE.Object3D[];
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
    const collisionDistance = 0.5;
    const pushbackDistance = 0.1;

    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotation
      if (moveStateRef.current.left) {
        camera.rotateY(rotationSpeed);
      }
      if (moveStateRef.current.right) {
        camera.rotateY(-rotationSpeed);
      }

      // Movement
      direction.set(0, 0, 0);
      if (moveStateRef.current.forward) {
        direction.z = -1;
      } else if (moveStateRef.current.backward) {
        direction.z = 1;
      }

      if (direction.length() > 0) {
        direction.applyQuaternion(camera.quaternion);
        direction.y = 0; // Keep movement in the xz plane
        direction.normalize();

        raycaster.set(camera.position, direction);
        const intersections = raycaster.intersectObjects(walls);

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
