import * as THREE from '/js/three.module.js';
import {OrbitControls} from "/js/OrbitControls.js"

//variable declaration section
let controls, clock, physicsWorld, scene, camera, renderer, rigidBodies = [], tmpTrans = null
let ballObject = null, moveDirection = { left: 0, right: 0, forward: 0, back: 0 }
let cbContactResult;

const STATE = { DISABLE_DEACTIVATION : 4 }

//initialise ammo
Ammo().then(start)

//start/init function
function start (){
    //array of bodies
    tmpTrans = new Ammo.btTransform();

    //setup physics
    setupPhysicsWorld();

    //setup and create objects
    setupGraphics();
    createBlock();
    createWalls();
    createBall();

    //setup callbacks
    setupContactResultCallback();
    setupEventHandlers();

    //run graphics
    renderFrame();
}

//set up worlds physics
function setupPhysicsWorld(){
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
}

//set up worlds graphics
function setupGraphics(){
    //create clock for timing
    clock = new THREE.Clock();

    //create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbfd1e5 );

    //create camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 5000 );
    camera.position.set( 0, 100, 0 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //add hemisphere light
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
    hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
    hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );

    //add directional light
    let dirLight = new THREE.DirectionalLight( 0xffffff , 1);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.multiplyScalar( 100 );
    scene.add( dirLight );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    let d = 75;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 13500;

    //setup the renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xbfd1e5 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    //add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0;
    controls.maxDistance = 90;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI/2 - 0.05
}

//render frame
function renderFrame(){
    let deltaTime = clock.getDelta();
    
    //update objects
    moveBall();
    updatePhysics( deltaTime );

    //update camera
    controls.update();

    //render updates
    renderer.render( scene, camera );
    requestAnimationFrame( renderFrame );
}

//setup event handlers
function setupEventHandlers(){
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'keydown', handleKeyDown, false);
    window.addEventListener( 'keyup', handleKeyUp, false);
}

//resize window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//handle keypresses
function handleKeyDown(event){
    let keyCode = event.keyCode;
    switch(keyCode){
        case 87: //W: FORWARD
            moveDirection.forward = 1
            break;  
        case 83: //S: BACK
            moveDirection.back = 1
            break;           
        case 65: //A: LEFT
            moveDirection.left = 1
            break;         
        case 68: //D: RIGHT
            moveDirection.right = 1
            break;    
        case 84://T
            checkContact();
            break; 
    }
}

//handle keypresses
function handleKeyUp(event){
    let keyCode = event.keyCode;
    switch(keyCode){
        case 87: //FORWARD
            moveDirection.forward = 0
            break;          
        case 83: //BACK
            moveDirection.back = 0
            break;         
        case 65: //LEFT
            moveDirection.left = 0
            break;         
        case 68: //RIGHT
            moveDirection.right = 0
            break;      
    }
} 

//create world base
function createBlock(){
    //world base dimensions
    let pos = {x: 0, y: 0, z: 0};
    let scale = {x: 100, y: 2, z: 100};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));
    //set position and scale
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    //set shadows
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    //name
    blockPlane.userData.tag = "floor";
    //add to world
    scene.add(blockPlane);

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
    //make collision shape
    let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );
    //set inertia
    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );
    //make rigid bodies
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
    //add friction
    body.setFriction(4);
    body.setRollingFriction(10);
    //add to physics world
    physicsWorld.addRigidBody( body );
    body.threeObject = blockPlane;
}

//array of maze
var amaze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,1,1,1,1,0,1],
    [1,0,0,1,1,1,0,1,1,1,1,1,0,0,0,0,1],
    [1,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,1,0,1,1,1,1,0,0,1,0,1,1,1,1],
    [1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];    

//create maze walls
function createWalls(){
    //wall dimensions
    let pos = {x: 0, y: 2.5, z: 0};
    let scale = {x: 5, y: 5, z: 5};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    
    var maze = new THREE.Object3D();
    for(let r=0;r<14;r++){
        for(let c=0;c<17;c++){
            if(amaze[r][c]==1){
                let x = (r-7)*5;
                let y = pos.y;
                let z = (c-8.5)*5;
                //threeJS Section
                let wall = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));
                //position and scale
                wall.position.set(x,y,z);
                wall.scale.set(scale.x, scale.y, scale.z);
                //set shadows
                wall.castShadow = true;
                wall.receiveShadow = true;
                //name wall
                wall.userData.tag = "wall at "+x.toString()+":"+z.toString();
                //add to maze
                maze.add(wall);

                //Ammojs Section
                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin( new Ammo.btVector3((r-7)*5, pos.y, (c-8.5)*5) );
                transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
                let motionState = new Ammo.btDefaultMotionState( transform );
                //make collision shape
                let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
                colShape.setMargin( 0.05 );
                //set inertia
                let localInertia = new Ammo.btVector3( 0, 0, 0 );
                colShape.calculateLocalInertia( mass, localInertia );
                //make rigid bodies
                let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
                let body = new Ammo.btRigidBody( rbInfo );
                //add friction
                body.setFriction(4);
                body.setRollingFriction(10);
                //add to physcis world
                physicsWorld.addRigidBody( body );
                //link three and ammo objects
                body.threeObject = wall;
            }
        }
    }
    //add to world
    scene.add(maze);

    /*//Ammojs Section
    for(let r=0;r<14;r++){
        for(let c=0;c<17;c++){
            if(amaze[r][c]==1){
                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin( new Ammo.btVector3((r-7)*5, pos.y, (c-8.5)*5) );
                transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
                let motionState = new Ammo.btDefaultMotionState( transform );
                //make collision shape
                let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
                colShape.setMargin( 0.05 );
                //set inertia
                let localInertia = new Ammo.btVector3( 0, 0, 0 );
                colShape.calculateLocalInertia( mass, localInertia );
                //make rigid bodies
                let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
                let body = new Ammo.btRigidBody( rbInfo );
                //add friction
                body.setFriction(4);
                body.setRollingFriction(10);
                //add to physcis world
                physicsWorld.addRigidBody( body );
            }
        }
    }*/
}

//create ball
function createBall(){
    //ball dimensions
    let pos = {x: 0, y: 4, z: 0};
    let radius = 2;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    //threeJS Section
    let ball = ballObject = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));
    //set positions
    ball.position.set(pos.x, pos.y, pos.z);
    //set shadows
    ball.castShadow = true;
    ball.receiveShadow = true;
    //name ball
    ball.userData.tag = "ball";
    //add to world
    scene.add(ball);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
    //make collision shape
    let colShape = new Ammo.btSphereShape( radius );
    colShape.setMargin( 0.05 );
    //set inertia
    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );
    //make rigid bodies
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
    //add friction
    body.setFriction(4);
    body.setRollingFriction(10);
    //set activation state
    body.setActivationState( STATE.DISABLE_DEACTIVATION )
    //add to physics world
    physicsWorld.addRigidBody( body );
    //link and start                                          
    ball.userData.physicsBody = body;
    rigidBodies.push(ball);
    body.threeObject = ball;
}

//contact test
function setupContactResultCallback(){

    cbContactResult = new Ammo.ConcreteContactResultCallback();
    
    cbContactResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
        
        let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );

        const distance = contactPoint.getDistance();

        if( distance > 0 ) return;

        let colWrapper0 = Ammo.wrapPointer( colObj0Wrap, Ammo.btCollisionObjectWrapper );
        let rb0 = Ammo.castObject( colWrapper0.getCollisionObject(), Ammo.btRigidBody );
        
        let colWrapper1 = Ammo.wrapPointer( colObj1Wrap, Ammo.btCollisionObjectWrapper );
        let rb1 = Ammo.castObject( colWrapper1.getCollisionObject(), Ammo.btRigidBody );

        let threeObject0 = rb0.threeObject;
        let threeObject1 = rb1.threeObject;

        let tag, localPos, worldPos

        if( threeObject0.userData.tag != "ball" ){

            tag = threeObject0.userData.tag;
            localPos = contactPoint.get_m_localPointA();
            worldPos = contactPoint.get_m_positionWorldOnA();

        }
        else{

            tag = threeObject1.userData.tag;
            localPos = contactPoint.get_m_localPointB();
            worldPos = contactPoint.get_m_positionWorldOnB();

        }
        
        let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
        let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

        console.log( { tag, localPosDisplay, worldPosDisplay } );
        
    }

}

//move ball
function moveBall(){
    //set scale
    let scalingFactor = 20;
    //movement 
    let moveX =  moveDirection.right - moveDirection.left;
    let moveZ =  moveDirection.back - moveDirection.forward;
    let moveY =  0; 
    //return if no movement
    if( moveX == 0 && moveY == 0 && moveZ == 0) return;
    //result of movement
    let resultantImpulse = new Ammo.btVector3( moveX, moveY, moveZ )
    resultantImpulse.op_mul(scalingFactor);
    //set velocity
    let physicsBody = ballObject.userData.physicsBody;
    physicsBody.setLinearVelocity( resultantImpulse );
}

//check for contact
function checkContact(){
    physicsWorld.contactTest( ballObject.userData.physicsBody , cbContactResult );
}

//update physics
function updatePhysics( deltaTime ){
    // step world
    physicsWorld.stepSimulation( deltaTime, 10 );
    // update rigid bodies
    for ( let i = 0; i < rigidBodies.length; i++ ) {
        let objThree = rigidBodies[ i ];
        let objAmmo = objThree.userData.physicsBody;
        let ms = objAmmo.getMotionState();
        if ( ms ) {
            //update objects in motion
            ms.getWorldTransform( tmpTrans );
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            objThree.position.set( p.x(), p.y(), p.z() );
            objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
        }
    }
    //detect collisions
    detectCollision();
}

//detect collisions
function detectCollision(){

	let dispatcher = physicsWorld.getDispatcher();
	let numManifolds = dispatcher.getNumManifolds();

	for ( let i = 0; i < numManifolds; i ++ ) {

		let contactManifold = dispatcher.getManifoldByIndexInternal( i );
		let numContacts = contactManifold.getNumContacts();

		for ( let j = 0; j < numContacts; j++ ) {

			let contactPoint = contactManifold.getContactPoint( j );
			let distance = contactPoint.getDistance();
            if( distance > 0.0 ) continue;
			//console.log({manifoldIndex: i, contactIndex: j, distance: distance});
            //alert({manifoldIndex: i, contactIndex: j, distance: distance})
		}


	}

}