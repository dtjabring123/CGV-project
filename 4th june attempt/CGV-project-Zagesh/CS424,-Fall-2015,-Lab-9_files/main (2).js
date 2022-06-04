import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js"
import {FirstPersonControls} from "./FirstPersonControls.js"
import {PointerLockControls} from "./PointerLockControls.js";
import {GLTFLoader} from "./GLTFLoader.js";
import {CharacterControls} from './characterControls.js';

var scene, camera, renderer, controls;
var diamond, ground; 
var directionalLight, ambientLight;
var model;
var container;
var cam2;
let iw, ih;
var startedTimer = 0;
var clock = new THREE.Clock();
var clock1 = new THREE.Clock();
var characterControls;
var countdown;
var storeCount=61;
var timePassed = 0;
var storeDelt;
var seconds;
const keysPressed = {};

var midh = window.innerHeight/2  -70;
var midw = window.innerWidth/2-60;
var midhB1 = window.innerHeight/2 +20;
midh = midh+"px";
midw = midw+"px";
midhB1 = midhB1 +"px";


// 1. Create the button
var creditsButton = document.createElement("button");
creditsButton.style.position = "absolute";
creditsButton.style.left = midw;
creditsButton.style.top = midhB1;
creditsButton.innerHTML = "CREDITS";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(creditsButton);

creditsButton.addEventListener ("click", function() {
    if(clock.running==true){console.log("PAUSED");
    document.getElementById("timer").innerHTML = "<h1>PAUSED</h1>";
    clock.stop();
    clock1.stop()
    storeCount = countdown;

    console.log("storecount is"+ storeCount);

}
    else if(clock.running==false){
        
        clock.start();
        clock1.start();
        console.log("storecount is"+storeCount);
       // timePassed= 63-Math.floor(storeCount);
     //   countdown = storeCount;
    }
 });

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


function startTimer(){ //inspired by: https://github.com/drnoir/animated-Three-js-Landing-page-template-with-counter


    startedTimer = 1;
    clock1.start()

    var x = setInterval(function() {

    // Get how much time has passed since level started
    var now = clock1.getElapsedTime();

    //get how much time has passed since getElapsedTime was called

  var currently = clock1.getDelta();
    //set that the timer must end 60 seconds from when it starts
   

  //  var endTime = storeDelt+(61-timePassed); 

    var endTime = currently+storeCount;

        // Get how much time has passed since level started
      //  var now = clock1.getElapsedTime();

    // Find the number of seconds between now and when the timer will end
    countdown =  endTime-now;
    console.log("countdown in timer is "+ countdown)
    var seconds = Math.floor(countdown);
    
    // Display the result in the element with id="dem"o"
    if(clock1.running==true){
    document.getElementById("timer").innerHTML ="<h1>Time left</h1><div class ='timerSec'>"+ seconds + " Seconds"+'</div></div>';
    }
    document.addEventListener('keydown', (event) => {

        if(characterControls.model.position.x >= diamond.position.x-3 && characterControls.model.position.x<=diamond.position.x+3){
        if(Math.abs(characterControls.model.position.z - diamond.position.z)<=2.5){
            clock1.stop();

                clearInterval(x);
                document.getElementById("timer").innerHTML = "<h1>SUCCESS</h1>";
       }
    }
    });
    

    // display a message when the countdown is over
    if (storeCount < 0 && countdown<0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "<h1>TIME'S UP!</h1>";
    }

    
    }, 1000);
}
function getTree(){


    const geometryPlane = new THREE.PlaneGeometry(30, 150);
    const materialPlane = new THREE.MeshBasicMaterial({
        visible: false
    });
    const meshPlane = new THREE.Mesh(geometryPlane, materialPlane);

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
    var texture = new THREE.TextureLoader().load(["512x_foliage_coarse01.png"])

    var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(q,w),
        new THREE.MeshStandardMaterial({map: texture})
    );
    mesh.rotation.x = -Math.PI/2;
    mesh.receiveShadow = true;
    return mesh;
}

function init(){
    window.addEventListener(
        "resize",
        function(){
            camera.aspect = this.innerWidth/this.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(this.innerWidth, this.innerHeight);

            iw = this.window.innerWidth/4;
            ih = this.window.innerHeight/4;

            cam2.aspect = iw/ih;
            cam2.updateProjectionMatrix();
        }
    )

    scene = new THREE.Scene();

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
    camera.position.set(0,30,35);
    camera.lookAt(0,0,-20);

    //SkyBox **************************************************************************************
    var skybox = new THREE.CubeTextureLoader().load([
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
    controls.minDistance = 30;
    controls.maxDistance = 45;
    controls.enablePan = false;
    //controls.maxPolarAngle = Math.PI/2 - 0.05

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

        var timey = clock1.getElapsedTime();
       //console.log(timey);
       // if(timey > 20){
       //     console.log("hi");
       // }

    }, false); 
    document.addEventListener('keyup', (event) => {
        keysPressed[event.key.toLowerCase()] = false;
    }, false);

  document.addEventListener('keydown', (event) => {

    //console.log(characterControls.model.position);
    if(characterControls.model.position.x >= newDiamond.position.x-3 && characterControls.model.position.x<=newDiamond.position.x+3){
    if(Math.abs(characterControls.model.position.z - newDiamond.position.z)<=2.5){
        if(startedTimer!=1){
        startTimer();
        }
   }
}
});

    //Objects **************************************************************************************
    ground = getGround(1200,1200);  //ground
    scene.add(ground);

    diamond = getDiamond(); //tepmorary diamond
    diamond.position.set(50,3,0);
    scene.add(diamond);

    let newDiamond = getDiamond(); //tepmorary diamond
    newDiamond.position.set(-50,3,0);
    scene.add(newDiamond);

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
    

    // adding timer stuff to the screen. Note that this works in conjunction with main.css code
    //inspired by: https://github.com/drnoir/animated-Three-js-Landing-page-template-with-counter

    container = document.createElement( 'div' );
    container.style.width = 90%
    container.style.alignSelf;
    document.body.appendChild( container );
  
    var timer = document.createElement( 'div' );
    var timerSec = document.createElement( 'div' );


    timer.style.position = 'absolute';
    timer.style.color = 'white';
    timer.style.top = '0%';
    timer.style.textAlign = 'center';
    timer.style.width = '100%';
    timer.style.margin = '0 auto';
    timer.innerHTML = '<div id = "timer"></div>'

    timerSec.style.width = "25%";
    timerSec.style.fontSize = "2em";
    timerSec.style.textAlign = 'center';
    
    container.appendChild( timer );
    timer.appendChild( timerSec );

}

init();

