"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Environment from "./Environment";
import Player from "./Player";

const Game: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 1.6, 5);

    const animate = () => {
      requestAnimationFrame(animate);
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

    setIsMounted(true);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("Key down in Game component:", event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      console.log("Key up in Game component:", event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isMounted]);

  return (
    <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}>
      <Environment scene={sceneRef.current} />
      {cameraRef.current && (
        <Player scene={sceneRef.current} camera={cameraRef.current} />
      )}
    </div>
  );
};

export default Game;
