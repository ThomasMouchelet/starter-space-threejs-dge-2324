import { useEffect, useRef, useState } from "react";
import { findAll } from "../services/solar-sytem.service";
import SolarSystem from "../threejs/SolarSystem";
import * as TWEEN from "@tweenjs/tween.js";
import createStarField from "../threejs/create_stars";
import initializeScene from "../threejs/InitializeScene";
import { clickPlanetListener, hoverPlanetListener } from "../threejs/EventsScene";
import UserInterface from "./UserInterface";
import initNebulas from "../threejs/InitNebulas";

const GalaxyCanva = () => {
  const canvasRef = useRef();
  const [solarSystemsData, setSolarSystemsData] = useState({});
  const [solarSystemsMesh, setSolarSystemsMesh] = useState([]);
  const [camera, setCamera] = useState(null);
  const [controls, setControls] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [scene, setScene] = useState(null);

  useEffect(() => {
    fetchAllSolarSystems();
  }, []);

  useEffect(() => {
    initializeThree();
  }, [solarSystemsData]);

  useEffect(() => {
    resizeListener();
  },[camera, renderer])

  useEffect(() => {
    initAnimate();
  },[renderer, solarSystemsMesh])
  
  useEffect(() => {
    initSolarsytems();
  }, [scene, solarSystemsData]);

  useEffect(() => {
    enventsListenerSolarSystems();
  }, [renderer, camera, controls, solarSystemsData, solarSystemsMesh]);

  const initializeThree = () => {
    // Scene
    const { scene, camera, controls, renderer } = initializeScene(canvasRef.current);

    setCamera(camera);
    setControls(controls);
    setRenderer(renderer);
    setScene(scene);
  };

  const resizeListener = () => {
    if(!camera ||!renderer) return;
    // Resize event listener
    window.addEventListener("resize", () => {
      // Update sizes
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
    });
  }

  const initAnimate = () => {
    if(!renderer) return;
    function animate() {
      requestAnimationFrame(animate);

      // console.log('animate solarSystems', solarSystems);
      solarSystemsMesh.forEach((solarSystem) => {
        solarSystem.update();
      });

      TWEEN.update(); // Mettre à jour l'animation de la caméra

      renderer.render(scene, camera);
    }

    animate();
  }

  const initSolarsytems = () => {
    if(!scene) return;

    const tempSolarSystems = []
    // Créer les étoiles
    createStarField(scene)

    initNebulas(scene);

    // Créer les systemes solaires (Faire apparaître une sphère pour chaque systeme solaire)
    solarSystemsData.forEach((solarSystemData, index) => {
      const solarSystem = new SolarSystem({
        solarSystemsData: solarSystemData,
        scene,
      });
      tempSolarSystems.push(solarSystem);
    });
    
    setSolarSystemsMesh(tempSolarSystems); 
  }

  const enventsListenerSolarSystems = () => {
    if(!renderer || !camera || !controls) return;

    // Déclancher les évenements de clique et de hover sur chaque sphère
    renderer.domElement.addEventListener("click", (e) => clickPlanetListener(e, camera, solarSystemsMesh, solarSystemsData, controls), false);
    window.addEventListener("mousemove", (e) => hoverPlanetListener(e, camera, solarSystemsMesh), false);
  }

  const fetchAllSolarSystems = async () => {
    try {
      const data = await findAll();
      setSolarSystemsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {solarSystemsData && solarSystemsData.length > 0 && 
        <UserInterface 
          solarSystemsData={solarSystemsData} 
          solarSystemsMesh={solarSystemsMesh}
          camera={camera}
          controls={controls}
        />
      }
      <canvas className="webgl" ref={canvasRef}></canvas>
    </div>
  )
};

export default GalaxyCanva;
