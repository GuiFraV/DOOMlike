import React, { useEffect } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

const TestPointerLock: React.FC = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Ajouter un cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Initialiser PointerLockControls
    const controls = new PointerLockControls(camera, document.body);

    // Événement pour verrouiller le pointeur lorsque l'utilisateur clique
    const onClick = () => {
      controls.lock();
    };
    document.addEventListener("click", onClick);

    controls.addEventListener("lock", () => {
      console.log("PointerLockControls : verrouillé");
    });

    controls.addEventListener("unlock", () => {
      console.log("PointerLockControls : déverrouillé");
    });

    document.addEventListener("pointerlockerror", (event) => {
      console.error("Erreur de verrouillage du pointeur", event);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      document.removeEventListener("click", onClick);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default TestPointerLock;
