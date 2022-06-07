import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js"
import {FirstPersonControls} from "./FirstPersonControls.js"
import {PointerLockControls} from "./PointerLockControls.js";
import {GLTFLoader} from "./GLTFLoader.js";
import {CharacterControls} from './characterControls.js';
import {Water} from './Water2.js';

var scene, camera, renderer, controls, cam2;
var diamond, ground, water; 
var directionalLight, ambientLight, spotLight;
var skybox;
var model, cube, cubeLight;

var viewType = false; // used to change viewtype


var midh = window.innerHeight/2  -70;
var midw = window.innerWidth/2-60;
var midhB1 = window.innerHeight/2 +20;
midh = midh+"px";
midw = midw+"px";
midhB1 = midhB1 +"px";

// // 1. Create the button
// var creditsButton = document.createElement("button");
// creditsButton.style.position = "absolute";
// creditsButton.style.left = midw;
// creditsButton.style.top = midhB1;
// creditsButton.innerHTML = "CREDITS";

// // 2. Append somewhere
// var body = document.getElementsByTagName("body")[0];
// body.appendChild(creditsButton);

// creditsButton.addEventListener ("click", function() {
//     if(clock.running==true){
//     clock.stop();}
//     else if(clock.running==false){
//         clock.start();
//     }
//  });

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        viewType = !viewType; //variable changed when ctrl key is clicked
    }
}, false);

var clock = new THREE.Clock();

var characterControls;
const keysPressed = {};


function animate(){

    requestAnimationFrame(animate);

    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    // if statement that changes view
    if (viewType == false){
        controls.maxPolarAngle = Math.PI/2 + 0.05;
        controls.minPolarAngle = 0;
        controls.minDistance = 30;
        controls.maxDistance = 30.1;
    }
    else {
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = Math.PI/2 + 0.01;
        controls.minDistance = 0;
        controls.maxDistance = 0.1;
    }
    controls.update();

    diamond.rotation.x += 0.02;
    diamond.rotation.y += 0.02;
    diamond.rotation.z += 0.02;

    cube.rotation.y += 0.1;

    renderer.setViewport(0,0,window.innerWidth,window.innerHeight); //Main camera view
    renderer.setScissorTest(false);
    renderer.render(scene, camera);

    renderer.setViewport(50,50,200,200); //Minimap camera view
    renderer.setScissor(50,50,200,200);
    renderer.setScissorTest(true);
    renderer.render(scene, cam2);

}

function getDiamond(){
    const geometry = new THREE.ConeGeometry(2, 5, 6);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        metalness: 1,
        roughness:0.5
    });
    const cone = new THREE.Mesh(geometry, material);

    cone.rotation.x = Math.PI;

    const geometryB = new THREE.ConeGeometry(2, 2, 6);
    const materialB = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        metalness: 1,
        roughness:0.5
    });
    const coneB = new THREE.Mesh(geometryB, materialB);

    coneB.rotation.x = Math.PI;
    coneB.position.y = -3.5;

    cone.castShadow = true;
    cone.receiveShadow = true;

    cone.add(coneB);

    return cone;
}

function getTree(){
    // var texture = new THREE.TextureLoader().load(["bark.jpg"])

    // const geometry = new THREE.CylinderGeometry(10, 10, 150, 50, 1);
    // const material = new THREE.MeshStandardMaterial({map: texture});
    // const mesh = new THREE.Mesh(geometry, material);

    const geometryPlane = new THREE.PlaneGeometry(30, 150);
    const materialPlane = new THREE.MeshBasicMaterial({
        visible: false
    });
    const meshPlane = new THREE.Mesh(geometryPlane, materialPlane);

    // mesh.add(meshPlane);

    // const geometryB = new THREE.IcosahedronGeometry(20, 0);
    // const materialB = new THREE.MeshStandardMaterial({color: 0x00ff00});
    // const meshB = new THREE.Mesh(geometryB, materialB);
    // meshB.position.y = 75;
    // meshB.castShadow = true;
    // meshB.receiveShadow = true;

    // const geometryC = new THREE.DodecahedronGeometry(20, 0);
    // const materialC = new THREE.MeshStandardMaterial({color: 0x028a0f});
    // const meshC = new THREE.Mesh(geometryC, materialC);
    // meshC.position.y = 75;
    // meshC.castShadow = true;
    // meshC.receiveShadow = true;

    // const geometryD = new THREE.ConeGeometry(20, 50, 64);
    // const materialD = new THREE.MeshStandardMaterial({color: 0x234f1e});
    // const meshD = new THREE.Mesh(geometryD, materialD);
    // meshD.position.y = 75;
    // meshD.castShadow = true;
    // meshD.receiveShadow = true;
    

    // var r = Math.floor(Math.random() * 3);
    // if (r == 0){
    //     mesh.add(meshB);
    // }
    // else if (r == 1){
    //     mesh.add(meshC);
    // }
    // else{
    //     mesh.add(meshD);
    // }

    // mesh.castShadow = true;
    // mesh.receiveShadow = true;

    return meshPlane;
}

function getBush(){
    var texture = new THREE.TextureLoader().load(["512x_foliage_coarse01.png"])

    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(53, 100, 10),
        new THREE.MeshStandardMaterial({map: texture})
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function getGround(q,w){
    const planeGeo = new THREE.PlaneGeometry(q,w, 1500, 1500);

    const mat = new THREE.MeshPhongMaterial();

    const texture = new THREE.TextureLoader().load(["512x_foliage_coarse01.png"]);
    mat.map = texture;

    const displacementMap = new THREE.TextureLoader().load(["River.png"]);
    mat.displacementMap = displacementMap;
    mat.displacementScale = 12;

    const plane = new THREE.Mesh(planeGeo, mat);
    
    plane.rotation.x = -Math.PI/2;
    plane.receiveShadow = true;
    return plane;
}

function getWater(q,w){
    const waterGeo = new THREE.PlaneGeometry(q, w);
    
    const water = new Water(waterGeo, {
        scale: 4,
        flowspeed: 0.7,
        reflectivity: 0.6,
    });
    
    water.rotation.x = -Math.PI/2;
    water.position.y = 0.7;
    water.receiveShadow = true;

    return water;
}

function getCube(){
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0xfda50f,
        emissive: 0xfda50f,
        emissiveIntensity: 10
    });
    const cube = new THREE.Mesh(geometry, material);

    return cube;
}

function getLight(){
    const ironMan = new THREE.PointLight(0xfda50f);
    ironMan.intensity = 1;
    ironMan.distance = 100;
    ironMan.decay = 2;
    ironMan.castShadow = true;

    return ironMan;
}



function init(){
    window.addEventListener(
        "resize",
        function(){
            camera.aspect = this.innerWidth/this.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(this.innerWidth, this.innerHeight);
        }
    )

    scene = new THREE.Scene();

    // scene.fog = new THREE.FogExp2(0xdddddd, 0.005);

    //Renderer **************************************************************************************
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(renderer.domElement);

    //Camera **************************************************************************************
    camera = new THREE.PerspectiveCamera(
        60, window.innerWidth/window.innerHeight,
        0.1,
        1000
    );

    cam2 = new THREE.PerspectiveCamera(
        60, window.innerHeight/window.innerHeight,
        0.1,
        1000
    );
    cam2.position.set(0,1000,0);
    cam2.lookAt(0,0,0);

    
    //SkyBox **************************************************************************************
    skybox = new THREE.CubeTextureLoader().load([
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg"]);

    scene.background = skybox;

    //Controls **************************************************************************************

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.enablePan = false;


    //Lighting **************************************************************************************
    ambientLight = new THREE.AmbientLight(0xeeeeee);
    ambientLight.intensity = 0.1;
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 0.2;
    directionalLight.position.set(5,200,5);
    directionalLight.castShadow = true;

    var d = 1000;

    directionalLight.shadow.mapSize.width = 8192; 
    directionalLight.shadow.mapSize.height = 8192;
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.right = d
    directionalLight.shadow.camera.left = -d
    directionalLight.shadow.camera.top = d
    directionalLight.shadow.camera.bottom = -d

    scene.add(directionalLight);
    
    spotLight = new THREE.SpotLight(0xffffff); // spot light pointing at diamond
    spotLight.position.set(0,100,0);
    spotLight.intensity = 1;
    spotLight.angle = Math.PI/6;

    scene.add(spotLight);
    
    //Player ************************************************************************************

    // MODEL WITH ANIMATIONS
    
    new GLTFLoader().load('./Soldier.glb', function (gltf) {
        model = gltf.scene;
        model.traverse(function (object) {
            if (object.isMesh)
                object.castShadow = true;
        });
        
        cube = getCube(); //cube and light added to model using hierachial modelling
        cubeLight = getLight();
        cube.add(cubeLight);

        cube.scale.set(0.2,0.2,0.2);
        cube.rotation.x = Math.PI/4;
        cube.rotation.z = Math.PI/4;
        cube.position.y = model.position.y + 1.85;
        
        model.add(cube);
        
        model.scale.set(10, 10, 10);
        model.position.z = 500;
        scene.add(model);

        const gltfAnimations = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);
        const animationsMap = new Map();
        gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
            animationsMap.set(a.name, mixer.clipAction(a));
        }); 
        characterControls = new CharacterControls(model, mixer, animationsMap, controls, camera, 'Idle');
    });
    // CONTROL KEYS
    
    document.addEventListener('keydown', (event) => {
        if (event.shiftKey && characterControls) {
            characterControls.switchRunToggle();
        }
        else {
            keysPressed[event.key.toLowerCase()] = true;
        }
    }, false);
    document.addEventListener('keyup', (event) => {
        keysPressed[event.key.toLowerCase()] = false;
    }, false);

    //Objects **************************************************************************************
    ground = getGround(1200, 1200);  //ground
    scene.add(ground);

    water = getWater(1200, 1200); //water
    scene.add(water);

    diamond = getDiamond(); //tepmorary diamond
    diamond.position.set(0,3,0);
    scene.add(diamond);

    var bush1 = getBush();
    bush1.position.set(-421.05, 50, 250);
    scene.add(bush1);

    var bush2 = getBush();
    bush2.position.set(-315.79, 50, 200);
    scene.add(bush2);

    var bush3 = getBush();
    bush3.position.set(368.42, 50, -200);
    scene.add(bush3);

    var bush4 = getBush();
    bush4.position.set(-130, 50, -421.05);
    bush4.rotation.y = Math.PI/2;
    scene.add(bush4);

    var bush5 = getBush();
    bush5.position.set(-120, 50, -315.79);
    bush5.rotation.y = Math.PI/2;
    scene.add(bush5);

    var bush6 = getBush();
    bush6.position.set(0, 50, -157.89);
    bush6.rotation.y = Math.PI/2;
    scene.add(bush6);

    var bush7 = getBush();
    bush7.position.set(0, 50, -263.16);
    bush7.rotation.y = Math.PI/2;
    scene.add(bush7);

    var bush8 = getBush();
    bush8.position.set(-51, 50, 157.89);
    bush8.rotation.y = Math.PI/2;
    scene.add(bush8);

    var bush9 = getBush();
    bush9.position.set(38, 50, 263.16);
    bush9.rotation.y = Math.PI/2;
    scene.add(bush9);

    var bush10 = getBush();
    bush10.position.set(300, 50, 368.42);
    bush10.rotation.y = Math.PI/2;
    scene.add(bush10);

    animate();
}

init();