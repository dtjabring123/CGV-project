import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js"
import {FirstPersonControls} from "./FirstPersonControls.js"

var scene, camera, renderer, controls;
var diamond, ground; 
var pointLight, ambientLight;

function animate(){
    requestAnimationFrame(animate);

    // diamond.rotation.x += 0.02;
    // diamond.rotation.y -= 0.02;
    // diamond.rotation.z += 0.02;

    controls.update();

    renderer.render(scene, camera);
}

function getDiamond(x,y,z){
    const geometry = new THREE.ConeGeometry(2, 5, 6);
    const material = new THREE.MeshStandardMaterial({color: 0xff00ff});
    const cone = new THREE.Mesh(geometry, material);

    cone.rotation.x = Math.PI;

    const geometryB = new THREE.ConeGeometry(2, 2, 6);
    const materialB = new THREE.MeshStandardMaterial({color: 0xff00ff});
    const coneB = new THREE.Mesh(geometryB, materialB);

    coneB.rotation.x = Math.PI;
    coneB.position.y = -3.5;

    cone.add(coneB);

    return cone;
}

function getTree(){
    var texture = new THREE.TextureLoader().load(["bark.jpg"])

    var mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 200, 50, 1),
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
            camera.aspect = this.innerWidth/this.innerHeight
            camera.updateProjectionMatrix();
            renderer.setSize(this.innerWidth, this.innerHeight)
        }
    )

    scene = new THREE.Scene();

    //Renderer **************************************************************************************
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(renderer.domElement);

    //Camera **************************************************************************************
    camera = new THREE.PerspectiveCamera(
        60, 800/600,
        0.1,
        1000
    );
    camera.position.set(0,6,10);
    camera.lookAt(0,0,0);

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

    //Lighting **************************************************************************************
    ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 0.1;
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff);
    pointLight.intensity = 1;
    pointLight.radius = 100;
    pointLight.position.set(10,10,10);
    pointLight.castShadow = true;
    scene.add(pointLight);

    //Objects **************************************************************************************
    ground = getGround(1000,1000);  //ground
    scene.add(ground);

    diamond = getDiamond(2,2,2); //tepmorary diamond
    diamond.position.set(0,3,0);
    diamond.castShadow = true;
    diamond.receiveShadow = true;
    scene.add(diamond);

    for (var i = -500; i <= 500; i=i+50){ //trees
        var tree = getTree();
        tree.position.set(i, 100, 500);
        scene.add(tree);
    }
    for (var i = -500; i <= 500; i=i+50){ //trees
        var tree = getTree();
        tree.position.set(i, 100, -500);
        scene.add(tree);
    }
    for (var i = -500; i <= 500; i=i+50){ //trees
        var tree = getTree();
        tree.position.set(500, 100, i);
        scene.add(tree);
    }
    for (var i = -500; i <= 500; i=i+50){ //trees
        var tree = getTree();
        tree.position.set(-500, 100, i);
        scene.add(tree);
    }

    animate();
}

init();