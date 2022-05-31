import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js"
import {FirstPersonControls} from "./FirstPersonControls.js"
import {PointerLockControls} from "./PointerLockControls.js";
import {GLTFLoader} from "./GLTFLoader.js";
import {CharacterControls} from './characterControls.js';
import {Water} from './Water2.js';

var scene, camera, renderer, controls;
var diamond, ground, water; 
var directionalLight, ambientLight;
var skybox;
var model;

var clock = new THREE.Clock();
var characterControls;
const keysPressed = {};


function animate(){

    requestAnimationFrame(animate);

    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    controls.update();

    diamond.rotation.x += 0.02;
    diamond.rotation.y -= 0.02;
    diamond.rotation.z += 0.02;


    renderer.render(scene, camera);

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
    controls.minDistance = 0;
    controls.maxDistance = 45;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI/2 - 0.05

    //Lighting **************************************************************************************
    ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 0.1;
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 0.7;
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
    
    //Player ************************************************************************************

    // MODEL WITH ANIMATIONS
    
    new GLTFLoader().load('./Soldier.glb', function (gltf) {
        model = gltf.scene;
        model.traverse(function (object) {
            if (object.isMesh)
                object.castShadow = true;
        });
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

    water = getWater(1200, 1200);
    scene.add(water);

    diamond = getDiamond(); //tepmorary diamond
    diamond.position.set(0,3,0);
    scene.add(diamond);

    //outside walls*************************************************************************
    // for (var i = -500; i <= 500; i=i+25){ //trees
    //     var treeB = getTree();
    //     if (!(i >= -25 && i <= 25)){
    //         treeB.position.set(i, 75, 500);
    //         scene.add(treeB);
    //     }


    //     var treeT = getTree();
    //     treeT.position.set(i, 75, -500);
    //     scene.add(treeT);

    //     var treeR = getTree();
    //     treeR.position.set(500, 75, i);
    //     treeR.rotation.y = Math.PI/2;
    //     scene.add(treeR);

    //     var treeL = getTree();
    //     treeL.position.set(-500, 75, i);
    //     treeL.rotation.y = Math.PI/2;
    //     scene.add(treeL);
    // }
    
    // //inside walls*************************************************************************
    // for (var i = -447.369; i <= 447.369; i=i+25){ //treeBs
    //     var treeB = getTree();
    //     treeB.position.set(i, 75, 447.369);
    //     scene.add(treeB);

    //     var treeA = getTree();
    //     if (!(i >= -236 && i <= -185)){
    //         treeA.position.set(i, 75, -447.369);
    //         scene.add(treeA);
    //     }

    //     var treeR = getTree();
    //     treeR.position.set(447.369, 75, i);
    //     treeR.rotation.y = Math.PI/2;
    //     scene.add(treeR);

    //     var treeL = getTree();
    //     if (!(i >= 289 && i <= 343)){
    //         treeL.position.set(-447.369, 75, i);
    //         treeL.rotation.y = Math.PI/2;
    //         scene.add(treeL);
    //     }
    // }

    // for (var i = -394.738; i <= 394.738; i=i+25){ //treeBs
    //     var treeB = getTree();
    //     if (!(i >= 230 && i <= 290)){
    //         treeB.position.set(i, 75, 394.738);
    //         scene.add(treeB);
    //     }

    //     var treeA = getTree();
    //     if (!(i >= 78 && i <= 132)){
    //         treeA.position.set(i, 75, -394.738);
    //         scene.add(treeA);
    //     }
        
    //     var treeR = getTree();
    //     treeR.position.set(394.738, 75, i);
    //     treeR.rotation.y = Math.PI/2;
    //     scene.add(treeR);

    //     var treeL = getTree();
    //     treeL.position.set(-394.738, 75, i);
    //     treeL.rotation.y = Math.PI/2;
    //     scene.add(treeL);
    // }

    // for (var i = -342.107; i <= 342.107; i=i+25){ //treeBs
    //     var treeB = getTree();
    //     treeB.position.set(i, 75, 342.107);
    //     scene.add(treeB);

    //     var treeA = getTree();
    //     treeA.position.set(i, 75, -342.107);
    //     scene.add(treeA);

    //     var treeR = getTree();
    //     if (!(i >= 26 && i <= 79)){
    //         treeR.position.set(342.107, 75, i);
    //         treeR.rotation.y = Math.PI/2;
    //         scene.add(treeR);
    //     }
        
    //     var treeL = getTree();
    //     if (!(i >= 26 && i <= 79)){
    //         treeL.position.set(-342.107, 75, i);
    //         treeL.rotation.y = Math.PI/2;
    //         scene.add(treeL);
    //     }
    // }

    // for (var i = -289.476; i <= 289.476; i=i+25){ //treeBs
    //     var treeB = getTree();
    //     if (!(i >= 184 && i <= 237)){
    //         treeB.position.set(i, 75, 289.476);
    //         scene.add(treeB);
    //     }

    //     var treeA = getTree();
    //     if (!(i >= -184 && i <= -132) || (i >= 26 && i <= 79)){
    //         treeA.position.set(i, 75, -289.476);
    //         scene.add(treeA);
    //     }

    //     var treeR = getTree();
    //     treeR.position.set(289.476, 75, i);
    //     treeR.rotation.y = Math.PI/2;
    //     scene.add(treeR);

    //     var treeL = getTree();
    //     treeL.position.set(-289.476, 75, i);
    //     treeL.rotation.y = Math.PI/2;
    //     scene.add(treeL);
    // }

    // for (var i = -236.845; i <= 236.845; i=i+25){ //treeBs
    //     var treeB = getTree();
    //     if (!(i >= -26 && i <= 27)){
    //         treeB.position.set(i, 75, 236.845);
    //         scene.add(treeB);
    //     }

    //     var treeA = getTree();
    //     treeA.position.set(i, 75, -236.845);
    //     scene.add(treeA);

    //     var treeR = getTree();
    //     treeR.position.set(236.845, 75, i);
    //     treeR.rotation.y = Math.PI/2;
    //     scene.add(treeR);

    //     var treeL = getTree();
    //     treeL.position.set(-236.845, 75, i);
    //     treeL.rotation.y = Math.PI/2;
    //     scene.add(treeL);
    // }

    // for (var i = -184.214; i <= 184.214; i=i+25){ //treeBs
    //     var treeB = getTree();
    //     treeB.position.set(i, 75, 184.214);
    //     scene.add(treeB);

    //     var treeA = getTree();
    //     if (!(i >= -78 && i <= -26)){
    //         treeA.position.set(i, 75, -184.214);
    //         scene.add(treeA);
    //     }

    //     var treeR = getTree();
    //     if (!(i >= 26 && i <= 79)){
    //         treeR.position.set(184.214, 75, i);
    //         treeR.rotation.y = Math.PI/2;
    //         scene.add(treeR);
    //     }

    //     var treeL = getTree();
    //     treeL.position.set(-184.214, 75, i);
    //     treeL.rotation.y = Math.PI/2;
    //     scene.add(treeL);
    // }

    // for (var i = -131.583; i <= 131.583; i=i+25){ //treeBs
    //     var treeB = getTree();
    //     if (!(i >= -50 && i <= 27)){
    //         treeB.position.set(i, 75, 131.583);
    //         scene.add(treeB);
    //     }
        
    //     var treeA = getTree();
    //     treeA.position.set(i, 75, -131.583);
    //     scene.add(treeA);

    //     var treeR = getTree();
    //     treeR.position.set(131.583, 75, i);
    //     treeR.rotation.y = Math.PI/2;
    //     scene.add(treeR);

    //     var treeL = getTree();
    //     treeL.position.set(-131.583, 75, i);
    //     treeL.rotation.y = Math.PI/2;
    //     scene.add(treeL);
    // }

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