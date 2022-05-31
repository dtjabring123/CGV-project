console.log('Hello World');
changeLevel(1)
function changeLevel(level){
    var page = document.createElement("script");
    switch(level){
        case 1:
            var src = "page1.js"
            break;
        case 2:
            var src = "page2.js"
            break;
        case 3:
            var src = "page3.js"
            break;
    }
    page.type = "module"
    page.src = src;
    document.body.appendChild(page);
}

export{changeLevel}