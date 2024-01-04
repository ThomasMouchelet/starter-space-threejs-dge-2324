import * as THREE from 'three';
import Middle_Nebula2 from "../assets/images/galaxy/Middle_Nebula2.png";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const initializeScene = (canvas) => {
    // Scene
    const scene = new THREE.Scene();

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    scene.background = cubeTextureLoader.load([
      Middle_Nebula2,
      Middle_Nebula2,
      Middle_Nebula2,
      Middle_Nebula2,
      Middle_Nebula2,
      Middle_Nebula2,
    ]);
    scene.background.minFilter = THREE.LinearFilter;

    const renderer = initRender(canvas)
    const camera = createCamera(scene);
    const controls = initOrbitControls(camera, renderer);
    initLight(scene);

    return {
        scene,
        camera,
        controls,
        renderer
    };
}

const initRender = (canvas) => {
    // Render
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
      });
      renderer.shadowMap.enabled = true; // Active les ombres
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type d'ombre pour une ombre plus douce

      // Set initial size
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

      return renderer;
}

const initLight = (scene: THREE.Scene) => {
    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
}

const createCamera = (scene: THREE.Scene) => {
    // Create a camera
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        3000
    );
    scene.add(camera);

    return camera;
}

const initOrbitControls = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 40;
    controls.maxDistance = 2000;

    return controls;
}

export default initializeScene;