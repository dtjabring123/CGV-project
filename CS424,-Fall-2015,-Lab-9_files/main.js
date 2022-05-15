import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js"
import {FirstPersonControls} from "./FirstPersonControls.js"

var scene, camera, renderer, controls;
var diamond, ground; 
var directionalLight, ambientLight;

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

function getTree(){
    var texture = new THREE.TextureLoader().load(["bark.jpg"])

    const geometry = new THREE.CylinderGeometry(10, 10, 150, 50, 1);
    const material = new THREE.MeshStandardMaterial({map: texture});
    const mesh = new THREE.Mesh(geometry, material);

    const geometryB = new THREE.IcosahedronGeometry(20, 0);
    const materialB = new THREE.MeshStandardMaterial({color: 0x00ff00});
    const meshB = new THREE.Mesh(geometryB, materialB);
    meshB.position.y = 75;
    meshB.castShadow = true;
    meshB.receiveShadow = true;

    const geometryC = new THREE.DodecahedronGeometry(20, 0);
    const materialC = new THREE.MeshStandardMaterial({color: 0x028a0f});
    const meshC = new THREE.Mesh(geometryC, materialC);
    meshC.position.y = 75;
    meshC.castShadow = true;
    meshC.receiveShadow = true;

    const geometryD = new THREE.ConeGeometry(20, 50, 64);
    const materialD = new THREE.MeshStandardMaterial({color: 0x234f1e});
    const meshD = new THREE.Mesh(geometryD, materialD);
    meshD.position.y = 75;
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
    ground = getGround(1000,1000);  //ground
    scene.add(ground);

    diamond = getDiamond(); //tepmorary diamond
    diamond.position.set(0,3,0);
    diamond.castShadow = true;
    diamond.receiveShadow = true;
    scene.add(diamond);

    //outside walls*************************************************************************
    for (var i = -500; i <= 500; i=i+25){ //trees
        var treeB = getTree();
        treeB.position.set(i, 75, 500);
        scene.add(treeB);

        var treeT = getTree();
        treeT.position.set(i, 75, -500);
        treeT.castShadow = true;
        scene.add(treeT);

        var treeR = getTree();
        treeR.position.set(500, 75, i);
        scene.add(treeR);

        var treeL = getTree();
        treeL.position.set(-500, 75, i);
        scene.add(treeL);
    }
    
    //inside walls*************************************************************************
    for (var i = -447.369; i <= 447.369; i=i+25){ //treeBs
        var treeB = getTree();
        treeB.position.set(i, 75, 447.369);
        scene.add(treeB);

        var treeA = getTree();
        if (!(i >= -236 && i <= -185)){
            treeA.position.set(i, 75, -447.369);
            scene.add(treeA);
        }

        var treeR = getTree();
        treeR.position.set(447.369, 75, i);
        scene.add(treeR);

        var treeL = getTree();
        if (!(i >= 289 && i <= 343)){
            treeL.position.set(-447.369, 75, i);
            scene.add(treeL);
        }
    }

    for (var i = -394.738; i <= 394.738; i=i+25){ //treeBs
        var treeB = getTree();
        if (!(i >= 230 && i <= 290)){
            treeB.position.set(i, 75, 394.738);
            scene.add(treeB);
        }

        var treeA = getTree();
        if (!(i >= 78 && i <= 132)){
            treeA.position.set(i, 75, -394.738);
            scene.add(treeA);
        }
        
        var treeR = getTree();
        treeR.position.set(394.738, 75, i)
        scene.add(treeR);

        var treeL = getTree();
        treeL.position.set(-394.738, 75, i);
        scene.add(treeL);
    }

    for (var i = -342.107; i <= 342.107; i=i+25){ //treeBs
        var treeB = getTree();
        treeB.position.set(i, 75, 342.107);
        scene.add(treeB);

        var treeA = getTree();
        treeA.position.set(i, 75, -342.107);
        scene.add(treeA);

        var treeR = getTree();
        if (!(i >= 26 && i <= 79)){
            treeR.position.set(342.107, 75, i);
            scene.add(treeR);
        }
        
        var treeL = getTree();
        if (!(i >= 26 && i <= 79)){
            treeL.position.set(-342.107, 75, i);
            scene.add(treeL);
        }
    }

    for (var i = -289.476; i <= 289.476; i=i+25){ //treeBs
        var treeB = getTree();
        if (!(i >= 184 && i <= 237)){
            treeB.position.set(i, 75, 289.476);
            scene.add(treeB);
        }

        var treeA = getTree();
        if (!(i >= -184 && i <= -132) || (i >= 26 && i <= 79)){
            treeA.position.set(i, 75, -289.476);
            scene.add(treeA);
        }

        var treeR = getTree();
        treeR.position.set(289.476, 75, i);
        scene.add(treeR);

        var treeL = getTree();
        treeL.position.set(-289.476, 75, i);
        scene.add(treeL);
    }

    for (var i = -236.845; i <= 236.845; i=i+25){ //treeBs
        var treeB = getTree();
        if (!(i >= -26 && i <= 27)){
            treeB.position.set(i, 75, 236.845);
            scene.add(treeB);
        }

        var treeA = getTree();
        treeA.position.set(i, 75, -236.845);
        scene.add(treeA);

        var treeR = getTree();
        treeR.position.set(236.845, 75, i);
        scene.add(treeR);

        var treeL = getTree();
        treeL.position.set(-236.845, 75, i);
        scene.add(treeL);
    }

    for (var i = -184.214; i <= 184.214; i=i+25){ //treeBs
        var treeB = getTree();
        treeB.position.set(i, 75, 184.214);
        scene.add(treeB);

        var treeA = getTree();
        if (!(i >= -78 && i <= -26)){
            treeA.position.set(i, 75, -184.214);
            scene.add(treeA);
        }

        var treeR = getTree();
        if (!(i >= 26 && i <= 79)){
            treeR.position.set(184.214, 75, i);
            scene.add(treeR);
        }

        var treeL = getTree();
        treeL.position.set(-184.214, 75, i);
        scene.add(treeL);
    }

    for (var i = -131.583; i <= 131.583; i=i+25){ //treeBs
        var treeB = getTree();
        if (!(i >= -50 && i <= 27)){
            treeB.position.set(i, 75, 131.583);
            scene.add(treeB);
        }
        
        var treeA = getTree();
        treeA.position.set(i, 75, -131.583);
        scene.add(treeA);

        var treeR = getTree();
        treeR.position.set(131.583, 75, i);
        scene.add(treeR);

        var treeL = getTree();
        treeL.position.set(-131.583, 75, i);
        scene.add(treeL);
    }

    animate();
}

init();