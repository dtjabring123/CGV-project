//get audio clip by ID



// function addMusic(){
    
//     var audio = document.getElementById("themeMusic");
    
    
//         audio.play();
//     }
    
var myMusic;
var musicOn=false;
function startMusic(src) {

  if(musicOn==false){
    musicOn=true;
    myMusic = new sound(src);
    myMusic.play();
    document.getElementById("musicButton").innerHTML="Music on"
  }
  else if(musicOn==true){
    musicOn=false;
    myMusic.stop();
    document.getElementById("musicButton").innerHTML="Music off"
  }
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

var music = document.getElementById("musicButton");
music.onclick=startMusic('../sounds/RPG-Intro_v001_Looping.mp3');