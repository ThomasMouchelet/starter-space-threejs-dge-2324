import * as THREE from 'three';

const createStarField = (scene: THREE.Scene) => {
    // Champ d'étoiles
    // V1
    const starCount = 20000; // Nombre d'étoiles
    const starSize = { min: 0.1, max: 0.5 }; // Taille minimale et maximale des étoiles
    
    // Créer une géométrie de points
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const sizes = [];
    
    for (let i = 0; i < starCount; i++) {
        // Position aléatoire
        positions.push((Math.random() - 0.5) * 2000); // x
        positions.push((Math.random() - 0.5) * 2000); // y
        positions.push((Math.random() - 0.5) * 2000); // z
    
        // Taille aléatoire
        sizes.push(THREE.MathUtils.randFloat(starSize.min, starSize.max));
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    // Créer un nouveau canvas pour la texture circulaire
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 16;
    textureCanvas.height = 16;
    
    const ctx = textureCanvas.getContext('2d');
    
    // Ajouter un effet d'ombre
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Couleur de l'ombre
    ctx.shadowBlur = 5;                     // Flou de l'ombre
    ctx.shadowOffsetX = 1;                  // Décalage X de l'ombre
    ctx.shadowOffsetY = 1;                  // Décalage Y de l'ombre
    
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    
    const circleTexture = new THREE.Texture(textureCanvas);
    circleTexture.needsUpdate = true;
    
    // Utiliser cette texture dans votre matériau PointsMaterial
    const material = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 1,
        map: circleTexture,
        transparent: true,
        sizeAttenuation: true,
        alphaTest: 0.5
    });
    
    // Créer les points et les ajouter à la scène
    const stars = new THREE.Points(geometry, material);
    
    scene.add(stars);
}


export default createStarField;