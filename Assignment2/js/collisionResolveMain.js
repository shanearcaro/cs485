import * as THREE from 'three';
import * as PHY from 'simplePhysics';

// Define orbit controls
import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";

// Create 3d entities
let renderer, scene, camera;

// Define world boundaries
let world = {
    x: 80,
    z: 80
};

// Empty list to hold all agents
let agentData = [];

// Radius of agent
const RADIUS = 1;

// Default agent model
const defaultAgentMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ff00
});

// Colliding agent model
const redAgentMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000
});

// Initialze the program and begin rendering
init();
render();

// Generate a random velocity
function getVelocity() {
    return Math.random() - 0.5;
}

function init() {
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; //
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Define the scene
    scene = new THREE.Scene();

    // Define the camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

    // Set default camera location
    camera.position.set(-67.26, 54.07, -3.77);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = -1.6267;
    camera.rotation.x = -0.46;

    // Define controls using orbitcontrols
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Generate light source
    const light = new THREE.PointLight(0xffffff, 0.9, 0, 100000);
    light.position.set(0, 50, 120);
    light.castShadow = true;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 5000; // default

    // Create directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.castShadow = true;
    directionalLight.position.set(-5, 20, 4);
    directionalLight.target.position.set(9, 0, -9);
    directionalLight.shadow.camera.left *= 9;
    directionalLight.shadow.camera.right *= 9;
    directionalLight.shadow.camera.top *= 9;
    directionalLight.shadow.camera.bottom *= 9;

    // Add the directional light
    scene.add(directionalLight);

    // Define axes
    scene.add(new THREE.AxesHelper(40));
    const loader = new THREE.TextureLoader();
    const texture = loader.load('resources/OIP.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = 40 / 32;
    texture.repeat.set(repeats, repeats);

    // Define floor textures
    const geometry = new THREE.PlaneGeometry(world.x, world.z, 10, 10);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
    });

    // Bind floor textures to grid object
    const grid = new THREE.Mesh(geometry, material);
    grid.castShadow = true; //default is false
    grid.receiveShadow = true; //default  
    grid.rotation.order = 'YXZ';
    grid.rotation.y = -Math.PI / 2;
    grid.rotation.x = -Math.PI / 2;
    scene.add(grid);

    // Generate agents
    let i = 0;
    let deltaSpacing = 5;
    let startX, startY, goalX, goalY;
    startX = -25;
    goalX = -25;
    startY = -30
    goalY = 30;

    // Loop over agent count
    while (i < 10) {
        agentData.push({
            index: i,
            x: startX + i * deltaSpacing,
            y: 2.0,
            z: startY,
            goal_x: goalX + i * deltaSpacing,
            goal_y: 0.0,
            goal_z: goalY,
            vx: getVelocity(),
            vy: 0.0,
            vz: getVelocity(),
            radius: RADIUS,
            colliding: false,
            invmass: 1
        })
        agentData.push({
            index: i + 1,
            x: goalX + i * deltaSpacing + RADIUS,
            y: 2.0,
            z: goalY,
            goal_x: startX + i * deltaSpacing + RADIUS,
            goal_y: 0.0,
            goal_z: startY,
            vx: getVelocity(),
            vy: 0.0,
            vz: getVelocity(),
            radius: RADIUS,
            colliding: false,
            invmass: 1
        })
        i += 1;
    }


    let agentGeometry, agentMaterial, agent;

    // Bind agent properties to agent
    agentData.forEach(function(item) {
        agentGeometry = new THREE.CylinderGeometry(item.radius, 1, 4, 16);
        agentMaterial = new THREE.MeshLambertMaterial({
            color: 0x00ff00
        });
        agent = new THREE.Mesh(agentGeometry, agentMaterial);
        agent.castShadow = true;
        agent.receiveShadow = true;
        scene.add(agent);
        item.agent = agent;
    });
}

// Render the scene
function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    PHY.step(RADIUS, agentData, world)
    agentData.forEach(function(member) {
        member.agent.position.x = member.x;
        member.agent.position.y = member.y;
        member.agent.position.z = member.z;

        // Update material
        member.agent.material = 
            member.colliding ? redAgentMaterial : defaultAgentMaterial
    });
    renderer.render(scene, camera);
};

animate();