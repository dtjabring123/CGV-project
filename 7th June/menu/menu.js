

// 1. Create the button
var button = document.createElement("button");
button.style.position = "absolute";
button.style.top = "0%"; //place in middle
button.style.left = "0%"; //place in middle
button.style.fontSize = "40px"
button.innerHTML = "START";


// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener ("click", function() {
console.log("start switch") //this is where we put code to say move to main.js !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});


// 1. Create the button
var button1 = document.createElement("button");
button1.style.position = "absolute";
button1.style.left = "0%";
button1.style.top = "30%"; //place a little bit below
button1.style.fontSize = "40px"
button1.innerHTML = "CREDITS";


// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button1);

// 3. Add event handler
button1.addEventListener ("click", function() {
     console.log("credits switch") //this is where we put code to say move to credits.js !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});


//instructions 
var instr = document.createElement("caption");
instr.style.fontSize = "25px"; //set size font
instr.innerHTML = "Use your mouse to change the view. Use WASD to move the character. Look for the treasure to escape the maze before time runs out."
body.appendChild(instr);
//writing game name
var nameGame = document.createElement("h1"); 
nameGame.innerHTML = "In Loving Memory...";
body.appendChild(nameGame);

//
document.body.style.backgroundColor = '#e4d9c9'; //setting backgound colour
