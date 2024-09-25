import * as THREE from "three";
import { DoorObject } from "../types/game";

interface EnvironmentProps {
  scene: THREE.Scene;
}

const CELL_SIZE = 5;
const WALL_HEIGHT = 3;
const WALL_THICKNESS = 0.5;
const DOOR_WIDTH = 4;
const DOOR_THICKNESS = 0.2;

// Types de cellules
const CELL_WALL = 1;
const CELL_PATH = 0;
const CELL_DOOR_HORIZONTAL = 2;
const CELL_DOOR_VERTICAL = 3;

const createEnvironment = ({
  scene,
}: EnvironmentProps): {
  walls: THREE.Object3D[];
  doors: DoorObject[];
  animate: () => void;
} => {
  const walls: THREE.Object3D[] = [];
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
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, 0);
  scene.add(floorMesh);

  // Grille de l'environnement (labyrinthe simple)
  const grid = [
    [1, 1, 1, 1, 1],
    [1, 0, 2, 0, 1],
    [1, 0, 0, 3, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
  ];

  const rows = grid.length;
  const cols = grid[0].length;

  // Parcours de la grille pour créer les murs et les portes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = grid[i][j];
      const x = (j - cols / 2) * CELL_SIZE;
      const z = (i - rows / 2) * CELL_SIZE;

      if (cell === CELL_WALL) {
        // Création du mur
        const wallGeometry = new THREE.BoxGeometry(
          CELL_SIZE,
          WALL_HEIGHT,
          CELL_SIZE
        );
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        wallMesh.position.set(x, WALL_HEIGHT / 2, z);
        scene.add(wallMesh);
        walls.push(wallMesh);
      } else if (cell === CELL_DOOR_HORIZONTAL || cell === CELL_DOOR_VERTICAL) {
        // Création de la porte
        const isHorizontal = cell === CELL_DOOR_HORIZONTAL;
        const doorGeometry = new THREE.BoxGeometry(
          isHorizontal ? DOOR_WIDTH : DOOR_THICKNESS,
          WALL_HEIGHT,
          isHorizontal ? DOOR_THICKNESS : DOOR_WIDTH
        );

        // Création de la porte avec les propriétés supplémentaires
        const doorMesh = Object.assign(
          new THREE.Mesh(doorGeometry, doorMaterial),
          {
            isOpen: false,
            pivot: new THREE.Object3D(),
          }
        ) as DoorObject;

        // Positionnement du pivot et de la porte
        doorMesh.pivot.position.set(x, WALL_HEIGHT / 2, z);
        doorMesh.position.set(0, 0, 0); // Position relative au pivot
        doorMesh.pivot.add(doorMesh);
        scene.add(doorMesh.pivot);

        doors.push(doorMesh);
      }
    }
  }

  // Ajout de la fonction animate pour animer les portes
  const animate = () => {
    doors.forEach((door) => {
      // Animation de l'ouverture/fermeture des portes
      const targetRotation = door.isOpen ? Math.PI / 2 : 0;
      door.pivot.rotation.y = THREE.MathUtils.lerp(
        door.pivot.rotation.y,
        targetRotation,
        0.1 // Vous pouvez ajuster ce facteur pour contrôler la vitesse
      );
    });
  };

  return { walls, doors, animate };
};

export default createEnvironment;
