"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Environment from "./Environment";

const Game: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 2, 10);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0);
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}>
      <Environment scene={sceneRef.current} />
    </div>
  );
};

export default Game;
