import * as THREE from "three";
import { DoorObject } from "../types/game";

interface EnvironmentProps {
  scene: THREE.Scene;
}

const CELL_SIZE = 5;
const WALL_HEIGHT = 3;
const WALL_THICKNESS = 0.5;
const DOOR_WIDTH = 4;
const DOOR_THICKNESS = 0.2; // Rendre la porte plus fine

// Constantes pour les types de cellules
const CELL_WALL = 1;
const CELL_PATH = 0;
const CELL_DOOR_HORIZONTAL = 2;
const CELL_DOOR_VERTICAL = 3;

const createEnvironment = ({
  scene,
}: EnvironmentProps): {
  objects: THREE.Object3D[];
  doors: DoorObject[];
  animate: () => void;
} => {
  const objects: THREE.Object3D[] = [];
  const doors: DoorObject[] = [];

  // Matériaux
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  // Lumières
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Création du sol
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, 0);
  scene.add(floorMesh);
  objects.push(floorMesh);

  // Fonction pour créer un mur
  const createWall = (x: number, z: number, width: number, depth: number) => {
    const wallGeometry = new THREE.BoxGeometry(width, WALL_HEIGHT, depth);
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(x, WALL_HEIGHT / 2, z);
    scene.add(wallMesh);
    objects.push(wallMesh);
  };

  // Fonction pour créer une porte
  const createDoor = (x: number, z: number, isHorizontal: boolean) => {
    const doorGeometry = new THREE.BoxGeometry(
      isHorizontal ? DOOR_WIDTH : DOOR_THICKNESS,
      WALL_HEIGHT,
      isHorizontal ? DOOR_THICKNESS : DOOR_WIDTH
    );
    const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial) as DoorObject;
    doorMesh.position.set(x, WALL_HEIGHT / 2, z);
    doorMesh.isOpen = false;
    doorMesh.pivot = new THREE.Object3D();
    doorMesh.pivot.add(doorMesh);
    doorMesh.pivot.position.set(x, WALL_HEIGHT / 2, z);
    scene.add(doorMesh.pivot);
    objects.push(doorMesh);
    doors.push(doorMesh);
  };

  // Création des murs
  createWall(0, -5, 10, WALL_THICKNESS); // Mur horizontal
  createWall(-5, 0, WALL_THICKNESS, 10); // Mur vertical

  // Création d'une porte
  createDoor(0, 0, true); // Porte horizontale au centre

  const animate = () => {
    for (const door of doors) {
      if (door.isOpen) {
        door.pivot.rotation.y = Math.min(
          door.pivot.rotation.y + 0.1,
          Math.PI / 2
        );
      } else {
        door.pivot.rotation.y = Math.max(door.pivot.rotation.y - 0.1, 0);
      }
    }
  };

  return { objects, doors, animate };
};

export default createEnvironment;
