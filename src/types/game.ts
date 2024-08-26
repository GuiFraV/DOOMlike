import * as THREE from "three";

export interface DoorObject extends THREE.Mesh {
  isOpen: boolean;
  pivot: THREE.Object3D;
}
