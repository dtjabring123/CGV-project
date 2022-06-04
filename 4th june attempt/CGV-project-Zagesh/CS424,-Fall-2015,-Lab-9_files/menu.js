
var midh = window.innerHeight/2  -70;
var midw = window.innerWidth/2-60;
var midhB1 = window.innerHeight/2 +20;
midh = midh+"px";
midw = midw+"px";
midhB1 = midhB1 +"px";

// 1. Create the button
var startButton = document.createElement("button");
startButton.style.position = "absolute";
startButton.style.left =midw;
startButton.style.top =midh;

startButton.innerHTML = "START";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(startButton);

// 3. Add event handler
startButton.addEventListener ("click", function() {
   location.href="forest.html"
});


// 1. Create the button
var creditsButton = document.createElement("button");
creditsButton.style.position = "absolute";
creditsButton.style.left = midw;
creditsButton.style.top = midhB1;
creditsButton.innerHTML = "CREDITS";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(creditsButton);

// 3. Add event handler
creditsButton.addEventListener ("click", function() {
    // changeLevel(3); //this is where we put code to say move to main.js !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    location.href = "timerMain.html"
});



//instructions 
var instr = document.createElement("caption");
instr.innerHTML = "To move the view use your mouse. To move the character use WASD. Look for the treasure to escape the maze."
body.appendChild(instr);
//writing game name
var nameGame = document.createElement("h1");
nameGame.innerHTML = "In Loving Memory...";
body.appendChild(nameGame);

//
document.body.style.backgroundColor = '#e4d9c9';


function music(song){
// ADDING MUSIC ################################################
const listener = new THREE.AudioListener();
camera.add(listener);

//audio loader (loads all mp3 files)
const audioLoader = new THREE.AudioLoader();

//for the background sound
//creates a nonpositional global audio object
const bgSound = new THREE.Audio(listener);
scene.add(bgSound);

//load the sound files
audioLoader.load('../sounds/Wii Music - Background Music.mp3', function( buffer ) {
    bgSound.setBuffer( buffer );
    bgSound.setLoop( true );  //sound will repeat 
    bgSound.setVolume( 0.4 ); //volume is 0-1

    bgSound.play(); //starts the sound now
});


}


music();