import * as THREE from "three";

interface EnvironmentProps {
  scene: THREE.Scene;
}

const createEnvironment = ({ scene }: EnvironmentProps): THREE.Mesh[] => {
  const walls: THREE.Mesh[] = [];

  // Ajout de lumières
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Création du sol
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  scene.add(floorMesh);

  // Création du plafond
  const ceilingMesh = floorMesh.clone();
  ceilingMesh.position.y = 3;
  scene.add(ceilingMesh);

  // Fonction pour créer un mur
  const createWall = (
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    depth: number
  ) => {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(x, y, z);
    scene.add(wallMesh);
    walls.push(wallMesh);
  };

  // Création des murs
  createWall(-10, 1.5, 0, 0.5, 3, 20); // Mur gauche
  createWall(10, 1.5, 0, 0.5, 3, 20); // Mur droit
  createWall(0, 1.5, -10, 20, 3, 0.5); // Mur du fond
  createWall(0, 1.5, 10, 20, 3, 0.5); // Mur avant

  // Ajout de quelques obstacles
  createWall(-5, 1.5, -5, 3, 3, 0.5);
  createWall(5, 1.5, 5, 0.5, 3, 3);

  return walls;
};

export default createEnvironment;
