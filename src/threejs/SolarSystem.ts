import * as THREE from "three"

export default class SolarSystem {
    constructor(data) {
        this.solarSystemMesh = null;

        this.circleSprite = null;
        this.textSprite = null;

        this.scene = data.scene
        this.solarSytemPosition = data.solarSystemsData.position;
        this.solarMode = false;

        this.orbitingPlanets = [];

        this.loadData(data.solarSystemsData);
    }

    setSolarMode(mode) {
        this.solarMode = mode;
    }

    // Méthode pour nettoyer les anciens objets
    clearSolarSystem() {
        if (this.solarSystemMesh) {
            this.scene.remove(this.solarSystemMesh);
            this.solarSystemMesh = null;
        }
        this.orbitingPlanets.forEach(planet => {
            this.scene.remove(planet);
        });
        this.orbitingPlanets = [];
    }

    // Méthode pour recharger et recréer les objets
    reloadSolarSystem(data) {
        this.clearSolarSystem();
        this.loadData(data);
    }

    getMeshes() {
        // Pour cet exemple, nous supposons que seul solarSystemMesh est important
        // Vous pouvez modifier cette logique pour inclure d'autres maillages si nécessaire
        return this.solarSystemMesh;
    }

    createTextTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Définissez la taille du canevas et le style du texte ici
        canvas.width = 256;
        canvas.height = 256;

        // Définir l'opacité globale (transparence)
        context.globalAlpha = 1; // Opacité de 50%

        context.fillStyle = 'rgb(67, 237, 248, 1)'; // Couleur du texte
        context.font = '50px Arial'; // Style du texte
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 64); // Position du texte dans le canevas
    
        // Créer la texture à partir du canevas
        return new THREE.CanvasTexture(canvas);
    }
    
    addTextToSolarSystem(name, solarSystemMesh) {
        const textTexture = this.createTextTexture(name);
        const textMaterial = new THREE.SpriteMaterial({ map: textTexture });
        const textSprite = new THREE.Sprite(textMaterial);
    
        textSprite.position.set(solarSystemMesh.position.x, solarSystemMesh.position.y +10, solarSystemMesh.position.z); // Ajustez la position en fonction de la taille de votre galaxie
        textSprite.scale.set(10, 10, 10); // Ajustez l'échelle en fonction de la taille de votre texte
    
        this.textSprite = textSprite
        this.scene.add(textSprite);
    }

    createCircleTexture() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const outerRadius = 128; // Rayon extérieur de l'anneau
        const innerRadius = 128; // Rayon intérieur de l'anneau
        const lineWidth = 4; // Épaisseur de la ligne de l'anneau
    
        // Agrandir le canevas pour tenir compte de l'épaisseur de l'anneau
        const canvasSize = (outerRadius + lineWidth) * 2;
        canvas.width = canvas.height = canvasSize;
    
        const center = canvasSize / 2; // Centre du canevas
    
        // Dessiner un anneau (cercle creux)
        context.beginPath();
        context.arc(center, center, outerRadius, 0, 2 * Math.PI, false);
        context.arc(center, center, innerRadius, 0, 2 * Math.PI, true);
        context.lineWidth = lineWidth;
        context.strokeStyle = 'rgb(67, 237, 248, 1)'; // Couleur et opacité de l'anneau
        context.stroke();
    
        // Créer la texture à partir du canevas
        return new THREE.CanvasTexture(canvas);
    }    

    addCircleToSolarSystem(solarSystemMesh) {
        const circleTexture = this.createCircleTexture();
        const circleMaterial = new THREE.SpriteMaterial({ map: circleTexture });
        const circleSprite = new THREE.Sprite(circleMaterial);
    
        circleSprite.position.set(solarSystemMesh.position.x, solarSystemMesh.position.y, solarSystemMesh.position.z); // Ajustez la position en fonction de la taille de votre galaxie
        circleSprite.scale.set(12, 12, 12);
    
        this.circleSprite = circleSprite
        this.scene.add(circleSprite);
    }

    loadData(data) {
        if(!this.solarMode){
            const solarSystemMesh = this.createPlanet(data)
            this.solarSystemMesh = solarSystemMesh;
            this.scene.add(solarSystemMesh);

            solarSystemMesh.name = data.name;
    
            // Ajouter le nom du systéme solaire
            this.addTextToSolarSystem(data.name, solarSystemMesh);
            this.addCircleToSolarSystem(solarSystemMesh);
        } else {
            data.planetsData.forEach(planetData => {
                const planetMesh = this.createPlanet(planetData);
                if (planetData.isCentral) {
                    this.solarSystemMesh = planetMesh;
                    this.addCircleToSolarSystem(planetMesh);
                    // this.addTextToSolarSystem(planetData.name, planetMesh);
                } else {
                    planetMesh.orbitRadius = planetData.orbitRadius;
                    planetMesh.orbitSpeed = planetData.orbitSpeed;
                    this.orbitingPlanets.push(planetMesh);
                }

                this.scene.add(planetMesh);
            });
        }

        this.addPointLight()
    }

    addPointLight() {
        const { x, y, z } = this.solarSytemPosition;
        // Adding point light
        const pointLight = new THREE.PointLight(0xffffff, 800, 3000);
        pointLight.position.set(x, y, z);
        this.scene.add(pointLight);
    }

    createPlanet(planetData) {
        // Créer l'étoile de la galaxy
        const textureLoader = new THREE.TextureLoader();
        // Faire la forme ronde avec la taille
        const geometry = new THREE.SphereGeometry(planetData.radius, 64, 64);
        // Ajouter la texture
        const materielConfig = {
            map: textureLoader.load(planetData.texture)
        }
        if(planetData.isCentral || this.solarMode === false) {
            materielConfig.emissive = 0xffff00,
            materielConfig.emissiveIntensity = .4
        }

        const material = new THREE.MeshStandardMaterial(materielConfig);
        const sphereMesh = new THREE.Mesh(geometry, material);
        sphereMesh.castShadow = true; // Permet à la planète de projeter des ombres
        sphereMesh.receiveShadow = true; // Permet à la planète de recevoir des ombres
        
        sphereMesh.position.y = this.solarSytemPosition.y;
        sphereMesh.speedRotate = planetData.speedRotate;
        sphereMesh.name = planetData.name;
        
        if (planetData.isCentral || this.solarMode === false) {
            sphereMesh.position.x = this.solarSytemPosition.x;
            sphereMesh.position.z = this.solarSytemPosition.z;
        }

        return sphereMesh;
    }

    update() {
        if(this.solarMode && this.orbitingPlanets.length > 0) {
            // Mettre à jour les positions des planètes en orbite
            this.orbitingPlanets.forEach(planet => {
                planet.position.x = this.solarSytemPosition.x + Math.cos(Date.now() * planet.orbitSpeed) * planet.orbitRadius;
                planet.position.z = this.solarSytemPosition.z + Math.sin(Date.now() * planet.orbitSpeed) * planet.orbitRadius;
                planet.rotateY(planet.speedRotate);
            });
        }
    }
}