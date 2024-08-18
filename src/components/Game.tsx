"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import createEnvironment from "./Environment";
import Player from "./Player";
import { updateVisibility } from "../utils/frustumCulling";
import PerformanceStats from "./PerformanceStats";

const Game: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [objects, setObjects] = useState<THREE.Object3D[]>([]);

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

    const environmentObjects = createEnvironment({ scene });
    setObjects(environmentObjects);

    const animate = () => {
      requestAnimationFrame(animate);
      updateVisibility(camera, environmentObjects);
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
    <>
      <PerformanceStats />
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}>
        {cameraRef.current && (
          <Player
            scene={sceneRef.current}
            camera={cameraRef.current}
            walls={objects.filter((obj) => obj instanceof THREE.Mesh)}
          />
        )}
      </div>
    </>
  );
};

export default Game;
