"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import createEnvironment from "./Environment";
import Player from "./Player";
import { updateVisibility } from "../utils/frustumCulling";
import PerformanceStats from "./PerformanceStats";
import { DoorObject } from "../types/game";

const Game: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [objects, setObjects] = useState<THREE.Object3D[]>([]);
  const [doors, setDoors] = useState<DoorObject[]>([]);
  const animationIdRef = useRef<number | null>(null); // Ref pour stocker l'ID de l'animation

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Placer le joueur au début du labyrinthe
    camera.position.set(0, 1.6, 10);
    camera.lookAt(0, 1.6, 0);

    const {
      objects: environmentObjects,
      doors: environmentDoors,
      animate: animateEnvironment,
    } = createEnvironment({ scene });
    setObjects(environmentObjects);
    setDoors(environmentDoors);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      updateVisibility(camera, environmentObjects);
      animateEnvironment(); // Ajoutez cette ligne pour animer les portes
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
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current); // Annuler l'animation en cours
      }
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
            doors={doors}
          />
        )}
      </div>
    </>
  );
};

export default Game;
