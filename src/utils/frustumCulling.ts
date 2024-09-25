import * as THREE from "three";

export function updateVisibility(
  camera: THREE.Camera,
  objects: THREE.Object3D[]
) {
  if (!objects || !Array.isArray(objects)) {
    console.error(
      "La variable 'objects' est undefined ou n'est pas un tableau."
    );
    return;
  }

  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);

  objects.forEach((object) => {
    if (object instanceof THREE.Mesh) {
      if (!object.geometry.boundingSphere) {
        object.geometry.computeBoundingSphere();
      }
      const center = object.geometry.boundingSphere!.center.clone();
      const radius = object.geometry.boundingSphere!.radius;
      center.applyMatrix4(object.matrixWorld);

      object.visible = frustum.intersectsSphere(
        new THREE.Sphere(center, radius)
      );
    }
  });
}
