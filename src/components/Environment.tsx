import * as THREE from "three";

interface EnvironmentProps {
  scene: THREE.Scene;
}

const CELL_SIZE = 5;
const WALL_HEIGHT = 3;
const WALL_THICKNESS = 0.5;

const createEnvironment = ({ scene }: EnvironmentProps): THREE.Object3D[] => {
  const objects: THREE.Object3D[] = [];

  // Matériaux
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2a0a });

  // Lumières
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Labyrinthe (1 = mur, 0 = chemin, 2 = porte)
  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 2, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 2, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 2, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  // Création du sol
  const floorGeometry = new THREE.PlaneGeometry(
    maze[0].length * CELL_SIZE,
    maze.length * CELL_SIZE
  );
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(
    (maze[0].length * CELL_SIZE) / 2 - CELL_SIZE / 2,
    0,
    (maze.length * CELL_SIZE) / 2 - CELL_SIZE / 2
  );
  scene.add(floorMesh);
  objects.push(floorMesh);

  // Création des murs et des portes
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        // Mur
        const wallGeometry = new THREE.BoxGeometry(
          CELL_SIZE,
          WALL_HEIGHT,
          WALL_THICKNESS
        );
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        wallMesh.position.set(j * CELL_SIZE, WALL_HEIGHT / 2, i * CELL_SIZE);
        scene.add(wallMesh);
        objects.push(wallMesh);

        // Mur perpendiculaire
        const wallGeometry2 = new THREE.BoxGeometry(
          WALL_THICKNESS,
          WALL_HEIGHT,
          CELL_SIZE
        );
        const wallMesh2 = new THREE.Mesh(wallGeometry2, wallMaterial);
        wallMesh2.position.set(
          j * CELL_SIZE,
          WALL_HEIGHT / 2,
          i * CELL_SIZE + CELL_SIZE / 2
        );
        scene.add(wallMesh2);
        objects.push(wallMesh2);
      } else if (maze[i][j] === 2) {
        // Porte
        const doorGeometry = new THREE.BoxGeometry(
          CELL_SIZE,
          WALL_HEIGHT,
          WALL_THICKNESS
        );
        const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
        doorMesh.position.set(j * CELL_SIZE, WALL_HEIGHT / 2, i * CELL_SIZE);
        scene.add(doorMesh);
        objects.push(doorMesh);
      }
    }
  }

  return objects;
};

export default createEnvironment;
