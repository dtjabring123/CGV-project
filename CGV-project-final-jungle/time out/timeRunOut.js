
// 1. Create the button
var button = document.createElement("button");
button.style.position = "absolute";
button.style.top = "0%"; //place in middle
button.style.left = "0%"; //place in middle
button.style.fontSize = "20px"
button.innerHTML = "RE-START LEVEL"; //write text

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener ("click", function() {
console.log("start switch") //this is where we put code to say stay on same level!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});


// 1. Create the button
//returning to main menu
var button1 = document.createElement("button");
button1.style.position = "absolute";
button1.style.left = "0%";
button1.style.top = "30%"; //slghty below 1st button
button1.style.fontSize = "17px" //size text
button1.innerHTML = "RETURN TO MAIN MENU"; //text

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button1);
// 3. Add event handler
button1.addEventListener ("click", function() {
     location.href='../menu.html'
});


//instructions  for game
var instr = document.createElement("caption");
instr.style.fontSize = "25px";
instr.innerHTML = "Use your mouse to change the view. Use WASD to move the character. Look for the treasure to escape the maze before time runs out."
body.appendChild(instr);
//header 
var nameGame = document.createElement("h1");
nameGame.style.position = "absolute";
nameGame.style.top = "-5%"; //move above
nameGame.innerHTML = "Oh no, time's up!";
body.appendChild(nameGame);
//header 2 
var slow = document.createElement("h1");
slow.innerHTML = "You were too slow, try again.";
slow.style.position = "absolute";
slow.style.top = "15%"; //place below first header
slow.style.fontSize = "80px";
body.appendChild(slow);



//
document.body.style.backgroundColor = '#101820FF'; //set background colour
