import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

const clickPlanetListener = (
  event,
  camera,
  solarSystems,
  solarSystemsData,
  controls
) => {
  event.preventDefault();

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Assurez-vous que cette ligne récupère correctement les objets à tester
  const objectsToTest = solarSystems.flatMap((solarSystem) =>
    solarSystem.getMeshes()
  ); // exemple de fonction pour récupérer les maillages
  const intersects = raycaster.intersectObjects(objectsToTest);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    // Parcourir les planètes pour changer le mode de la planète
    solarSystems.forEach((solarSystem) => {
      if (solarSystem.solarSystemMesh.name === clickedObject.name) {
        if (solarSystem.solarMode === false) {
          solarSystem.setSolarMode(true);
          const solarSystemFind = solarSystemsData.find(
            (data) => data.name === clickedObject.name
          );
          solarSystem.reloadSolarSystem(solarSystemFind);
        }
      } else {
        solarSystem.setSolarMode(false);
        const solarSystemFind = solarSystemsData.find(
          (data) => data.name !== clickedObject.name
        );
        solarSystem.reloadSolarSystem(solarSystemFind);
      }
    });

    focusOnPlanet(clickedObject, camera, controls);
  }
};

const selectPlanetUI = (planetMesh, camera, controls, solarSystems, solarSystemsData) => {


  // solarSystems.forEach((solarSystem) => {
  //   if (solarSystem.solarSystemMesh.name === planetMesh.name) {
  //     if (solarSystem.solarMode === false) {
  //       solarSystem.setSolarMode(true);
  //       const solarSystemFind = solarSystemsData.find(
  //         (data) => data.name === planetMesh.name
  //       );
  //       solarSystem.reloadSolarSystem(solarSystemFind);
  //     }
  //   } else {
  //     solarSystem.setSolarMode(false);
  //     const solarSystemFind = solarSystemsData.find(
  //       (data) => data.name !== planetMesh.name
  //     );
  //     solarSystem.reloadSolarSystem(solarSystemFind);
  //   }
  // });

  const planet = planetMesh.solarSystemMesh
  focusOnPlanet(planet, camera, controls);
}

const focusOnPlanet = (sphereMesh, camera, controls) => {
  const newCameraPosition = sphereMesh.position.clone();

  newCameraPosition.z += 150; // Ajuster cette valeur pour contrôler la distance de zoom

  // Animer le déplacement de la caméra
  new TWEEN.Tween(camera.position)
    .to(newCameraPosition, 1000) // 1000 ms pour l'animation
    .easing(TWEEN.Easing.Quadratic.Out) // Type d'animation
    .start();

  // Orienter la caméra vers l'objet et mettre à jour la cible des OrbitControls
  new TWEEN.Tween(controls.target)
    .to(sphereMesh.position, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      const position = sphereMesh.position.clone();
      camera.lookAt(position);
      controls.target.set(position.x, position.y, position.z);
      controls.update();
    })
    .start();
};

const hoverPlanetListener = (event, camera, solarSystems) => {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Teste le survol sur les sphères et les cercles
  const objectsToTest = solarSystems.flatMap((solarSystem) => [
    solarSystem.solarSystemMesh,
    solarSystem.circleSprite,
  ]);
  const intersects = raycaster.intersectObjects(objectsToTest);

  // Réinitialiser l'opacité de tous les cercles et de tous les textes
  solarSystems.forEach((solarSystem) => {
    if (solarSystem.circleSprite) {
      solarSystem.circleSprite.material.opacity = 0.3;
      solarSystem.textSprite.material.opacity = 0.3;
    }
  });

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    const solarSystem = solarSystems.find(
      (ss) =>
        ss.solarSystemMesh === intersectedObject ||
        ss.circleSprite === intersectedObject
    );
    if (solarSystem && solarSystem.circleSprite) {
      // Augmenter l'opacité du cercle
      solarSystem.circleSprite.material.opacity = 0.8;
      solarSystem.textSprite.material.opacity = 0.8;
    }
  }
};

export { clickPlanetListener, hoverPlanetListener, selectPlanetUI };
