import * as THREE from 'three';
import Middle_Nebula2 from "../assets/images/galaxy/Miriade.png";

const initNebulas = (scene) => {

     // Définir les shaders
     const vertexShader = `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
     `;
 
     const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D map;
        
        void main() {
            vec4 texColor = texture2D(map, vUv);
            
            // Ajuster l'opacité en fonction de la luminosité de la couleur
            float luminance = 0.299 * texColor.r + 0.587 * texColor.g + 0.114 * texColor.b;
            float alpha = smoothstep(0.0, 0.1, luminance); // Adoucir les bords entre les zones transparentes et opaques
        
            gl_FragColor = vec4(texColor.rgb, alpha); // Utiliser l'alpha calculé
        }
     `;

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(Middle_Nebula2);
    const customMaterial = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: texture }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true
    });

    const geometry = new THREE.SphereGeometry(300, 300, 300);
    // const geometry = new THREE.PlaneGeometry(150, 150);
    const sphere = new THREE.Mesh(geometry, customMaterial);
    scene.add(sphere);

    sphere.position.set(-1000, 0, 0); // Position initiale
    // Vous pouvez ajouter une animation si vous le souhaitez
}

export default initNebulas;