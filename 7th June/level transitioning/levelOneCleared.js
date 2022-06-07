
// 1. Create the button
//play next level
var button = document.createElement("button");
button.style.position = "absolute";
button.style.top = "0%";
button.style.left = "0%";
button.style.fontSize = "20px"
button.innerHTML = "PLAY NEXT LEVEL";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener ("click", function() {
console.log("start switch") //this is where we put code to say move to next leveljs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});


// 1. Create the button for replaying
var replayButton = document.createElement("button");
replayButton.style.position = "absolute";
replayButton.style.top = "30%"; //move below first button
replayButton.style.left = "0%";
replayButton.style.fontSize = "20px"
replayButton.innerHTML = "REPLAY LEVEL"; //text

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(replayButton);

// 3. Add event handler
replayButton.addEventListener ("click", function() {

location.href = '../timerMain.html'
console.log("replay level") //this is where we put code to say restart this level js !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});


// 1. Create the button to go back to main menu
var menuButton = document.createElement("button");
menuButton.style.position = "absolute";
menuButton.style.left = "0%";
menuButton.style.top = "60%"; //move under 2nd button
menuButton.style.fontSize = "17px" //set size text
menuButton.innerHTML = "RETURN TO MAIN MENU"; ///text

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(menuButton);
// 3. Add event handler
menuButton.addEventListener ("click", function() {
location.href='../menu.html'
     
    // console.log("credits switch") //this is where we put code to say move to main menue .js !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});


//instructions 
var instr = document.createElement("caption");
instr.style.fontSize = "25px";
instr.innerHTML = "Use your mouse to change the view. Use WASD to move the character. Look for the treasure to escape the maze before time runs out."
body.appendChild(instr);
//writing game name
var nameGame = document.createElement("h1");
nameGame.style.position = "absolute";
nameGame.style.top = "-5%"; //move above
nameGame.innerHTML = "Hooray, you found the diamond!";
body.appendChild(nameGame);
//writing game name
var slow = document.createElement("h1");
slow.innerHTML = "A new level was unlocked.";
slow.style.position = "absolute";
slow.style.top = "15%"; //move below
slow.style.fontSize = "80px";
body.appendChild(slow);



//
document.body.style.backgroundColor = '#00917C';
