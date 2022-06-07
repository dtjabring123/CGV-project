
// 1. Create the button
//replay level 1
var replayOne = document.createElement("button");
replayOne.style.position = "absolute";
replayOne.style.top = "-20%";
replayOne.style.left = "0%";
replayOne.style.fontSize = "20px"
replayOne.innerHTML = "REPLAY LEVEL 1";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(replayOne);

// 3. Add event handler
replayOne.addEventListener ("click", function() {
console.log("start switch") //switch to level one html file
});

// 1. Create the button for replaying level 2
var replayTwo = document.createElement("button");
replayTwo.style.position = "absolute";
replayTwo.style.top = "5%"; //move below first button
replayTwo.style.left = "0%";
replayTwo.style.fontSize = "20px"
replayTwo.innerHTML = "REPLAY LEVEL 2";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(replayTwo);

// 3. Add event handler
replayTwo.addEventListener ("click", function() {
console.log("replay level") //send to level 2 html page
});


// 1. Create the button for replaying level 3
var replayThree = document.createElement("button");
replayThree.style.position = "absolute";
replayThree.style.top = "30%"; //move below second button
replayThree.style.left = "0%";
replayThree.style.fontSize = "20px"
replayThree.innerHTML = "REPLAY LEVEL 3"; 

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(replayThree);

// 3. Add event handler
replayThree.addEventListener ("click", function() {
     location.href = '../index.html';
});


// 1. Create the button to go back to main menu
var menuButton = document.createElement("button");
menuButton.style.position = "absolute";
menuButton.style.left = "0%";
menuButton.style.top = "55%"; //move under 2nd button
menuButton.style.fontSize = "17px" //set size text
menuButton.innerHTML = "RETURN TO MAIN MENU"; ///text

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(menuButton);

// 3. Add event handler
menuButton.addEventListener ("click", function() {
     console.log("credits switch")//move to main menu
});

//writing you found the treasure
var nameGame = document.createElement("h1");
nameGame.style.position = "absolute";
nameGame.style.top = "-5%"; //move above
nameGame.innerHTML = "You found the treasure!";
body.appendChild(nameGame);

//writing game name
var completed = document.createElement("h1");
completed.innerHTML = "Congratulations, you've completed all levels.";
completed.style.position = "absolute";
completed.style.top = "16%"; //move below
completed.style.fontSize = "60px";
body.appendChild(completed);

document.body.style.backgroundColor = '#8FBFA8';
