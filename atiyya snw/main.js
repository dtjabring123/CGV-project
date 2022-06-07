import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js"
import {FirstPersonControls} from "./FirstPersonControls.js"
import {GLTFLoader} from "./GLTFLoader.js"; 

var scene, camera, renderer, controls;
var diamond, ground; 
var directionalLight, ambientLight;

//for the maze 
const wallSize = 5;

const tombWall = new THREE.BoxBufferGeometry(wallSize,10,wallSize);
const tombWallTexture = new THREE.MeshLambertMaterial({color: "rgb(65,65,65)"});


var amaze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,0,0,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1],
    [1,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1],
    [1,0,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,0,1,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,1,1,1],
    [1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1],
    [1,0,1,1,0,1,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,0,0,1],
    [1,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,0,0,1,0,1,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,0,0,1],
    [1,0,1,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,1],		
    [1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],	
    [1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1],	
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],	
    [1,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,1],	
    [1,0,0,0,0,0,1,0,0,0,0,1,0,1,1,1,0,1,1,1,1,1,1,0,1],	
    [1,0,0,1,1,1,1,0,1,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],	
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1,1,0,1,0,1],	
    [1,1,1,1,1,1,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,0,1,0,1],	
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],	
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]	
  ];



//##########################################

function animate(){
    requestAnimationFrame(animate);

    diamond.rotation.x += 0.02;
    diamond.rotation.y -= 0.02;
    diamond.rotation.z += 0.02;

    controls.update();

    renderer.render(scene, camera);
}


function getDiamond(){
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

/*function addSnowflakes(){
    //falling snow
    let particles; //snowflakes 
    //snowflakes positions (x,y,z) and the velocities(x,y,z)
    let positions = [], velocities = []; 

    //places from -500 to 500 (x and z axes)
    const numSnowflakes = 15000;
    const maxRange = 1000; 

    const minRange = maxRange/2;
    const minHeight = 150; //placed from 150 to 500 on the y axis

    //stores the data in an array with individual attributes 
    const geometry = new THREE.BufferGeometry();
    const txtLoader = new THREE.TextureLoader();

    //addSnowflakes();

    for(let i=0; i<numSnowflakes; i++){
        positions.push(
            Math.floor(Math.random()* maxRange - minHeight), //x -500 to 500
            Math.floor(Math.random()* minRange + minHeight), //y 250 to 750
            Math.floor(Math.random()* maxRange - minRange) //z -500 to 500
        );

        velocities.push(
            Math.floor(Math.random()* 6 - 3)*0.1,  //x -0.3 to 0.3
            Math.floor(Math.random()* 5 + 0.12)*0.18, //y 0.02 to 0.92
            Math.floor(Math.random()* 6 - 3)* 0.1 //z -0.3 to 0.3
        );
        

    } //end of for loop 


    //each attribute has an array of values
    //                      name                                        object   itemSize(x,y,z)=1 vector
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities,3));
}*/

function getTree(){
    var texture = new THREE.TextureLoader().load(["bark2.jpg"]);

    const geometry = new THREE.CylinderGeometry(10, 10, 100, 50, 1);
    new THREE.CylinderGeometry()
    const material = new THREE.MeshStandardMaterial({map: texture});
    const mesh = new THREE.Mesh(geometry, material);

    const geometryB = new THREE.IcosahedronGeometry(20, 0);
    const materialB = new THREE.MeshStandardMaterial({color: 0xc2c9d3});
    const meshB = new THREE.Mesh(geometryB, materialB);
    meshB.position.y = 37.5;
    meshB.castShadow = true;
    meshB.receiveShadow = true;

    const geometryC = new THREE.DodecahedronGeometry(22, 0);
    const materialC = new THREE.MeshStandardMaterial({color: 0xe2fcff});
    const meshC = new THREE.Mesh(geometryC, materialC);
    meshC.position.y = 60;
    meshC.castShadow = true;
    meshC.receiveShadow = true;

    const geometryD = new THREE.ConeGeometry(20, 50, 64);
    const materialD = new THREE.MeshStandardMaterial({color: 0x97dff0});
    const meshD = new THREE.Mesh(geometryD, materialD);
    meshD.position.y =60;
    meshD.castShadow = true;
    meshD.receiveShadow = true;
    

    var r = Math.floor(Math.random() * 3);
    if (r == 0){
        mesh.add(meshB);
    }
    else if (r == 1){
        mesh.add(meshC);
    }
    else{
        mesh.add(meshD);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
}

function getGround(q,w){
    var texture = new THREE.TextureLoader().load(["snow01.png"])

    var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(q,w),
        new THREE.MeshStandardMaterial({map: texture})
    );
    mesh.rotation.x = -Math.PI/2;
    mesh.receiveShadow = true;
    return mesh;
}


function makeWall(){
    var wall = new THREE.Mesh(tombWall,tombWallTexture);

    const texLoader = new THREE.TextureLoader();
    /*var texture = new THREE.TextureLoader().load(['./Wall/WallNormal.png']);

    var wall = new THREE.Mesh(
        new THREE.BoxBufferGeometry(wallSize,10,wallSize),
        new THREE.MeshStandardMaterial({map: texture})
    );*/
    return wall;
  }
  
function getMaze(){
    var maze = new THREE.Object3D();
    for(let r=0;r<25;r++){ //rows 
      for(let c=0;c<25;c++){ //columns 
        if(amaze[r][c]==1){
          var wall = new makeWall();
          wall.position.set(r*5,5,c*5);
          maze.add(wall);
        }
      }
    }
    //maze.add(wall);
    return maze;
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
    camera.position.set(0,1000,0);
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

    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 1;
    directionalLight.position.set(100,100,100);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default

    scene.add(directionalLight);

    //Objects **************************************************************************************
    ground = getGround(1200,1200);  //ground
    scene.add(ground);

    diamond = getDiamond(); //tepmorary diamond
    diamond.scale.set(3,3,3);
    diamond.position.set(0,10,-200);
    diamond.castShadow = true;
    diamond.receiveShadow = true;
    scene.add(diamond);

    let maze = getMaze();
    maze.scale.set(7,7,7);
    //maze.rotation.y = -Math.PI/2;
    
    //positive x is right 
    //negative z is up 
    maze.position.set(-420,0,-420); //scale and move the maze
    scene.add(maze);
    
    //snow 
    //let snow = addSnowflakes();
    //scene.add(snow);

    //dog 
    const loadingManager = new THREE.LoadingManager(); //create a loading manager

    const progressBar = document.getElementById('progress-bar'); //refering to css loading bar 
    loadingManager.onProgress = function(url,loaded,total){ //onprogress gives loaded and total %
        progressBar.value = (loaded/total)*100; //moving loading bar 
    }

    const progressBarContainer = document.querySelector('.progress-bar-container'); //refers to the overlay of progress bar in css
    loadingManager.onLoad = function(){ //onload tells us when loading is complete
        progressBarContainer.style.display = 'none'; //remove when loading complete
    }

    

    const glftLoader = new GLTFLoader(loadingManager);
    glftLoader.load('./wall_clock/scene.gltf', (gltfScene) => {
      let loadedModel = gltfScene;
      console.log("loadedModel");

      gltfScene.scene.rotation.x = -Math.PI/2 ;
      gltfScene.scene.position.z = 500;
      gltfScene.scene.position.x = 500;
      gltfScene.scene.position.y = 30;

      gltfScene.scene.scale.set(0.1, 0.1, 0.1);
      scene.add(gltfScene.scene);
      console.log(loadedModel.scene.position);
    });

    const glftLoader1 = new GLTFLoader(loadingManager);
    glftLoader1.load('./shiba/scene.gltf', (gltfScene1) => {
      let loadedModel1 = gltfScene1;
      console.log("loadedModel");

     // gltfScene.scene.rotation.x = -Math.PI/2 ;
      gltfScene1.scene.position.z = 450;
      gltfScene1.scene.position.x = 450;
      gltfScene1.scene.position.y = 30;

      gltfScene1.scene.scale.set(30, 30, 30);
      scene.add(gltfScene1.scene);
      console.log(loadedModel1.scene.position);
    });


    animate();
}

init();