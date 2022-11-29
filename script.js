let bg = document.getElementById("bg");
let body = document.getElementById("body");
let bird = document.getElementById("bird");
let birdtopmargin = 37.5;
let wallinterruption = false; // will be used to remove the further walls that would be coming after gameover
let interruption = false; // will be used when keydown called so key up can be stopped;
let dead = false;
let currentscore = 0;
let running = false;
let speed = 4000;

// this will load click here to start the game and will only be available when user open for the first time
addEventListener("DOMContentLoaded", () => {
    let button = document.getElementById("footer");
    button.innerHTML = "Tap/Click/Press Space To Start";
});

// sleep function to delay the gaps between the walls generated
function sleep(waitTime){
    return new Promise(r => setTimeout(r, waitTime));
}

// this will start the game
async function gameStart(){
    document.documentElement.requestFullscreen();
    if(running == false){
        running = true;
        let button = document.getElementById("footer");
        button.innerHTML = "Space/Tap to Jump";
        i = 0;
        while(dead == false){
            wallGenerator(i);
            level(i);
            check(i);
            await sleep(speed);
            i++;
        }
    }
}

async function wallGenerator(i){
    let div = document.createElement("div");
    let innerdiv = document.createElement("div");
    let random = (Math.floor(Math.random()*55));
    innerdiv.style.marginTop = random + "vh";
    innerdiv.className = "innergap";
    innerdiv.id = "innerwall" + i;
    div.id = "wall" + i;
    div.className = "wall";
    let animation = "movingwalls 5s forwards cubic-bezier(1,1,1,1)";
    // alert(animation);
    div.style.animation = animation;
    div.appendChild(innerdiv);
    bg.appendChild(div);
}

async function up(event){
    restart();
    gameStart();
    if(event.code == "Space" || event.type == "touchstart"){
        for(let i = 0; i < 15; i++){
            if(birdtopmargin <= 0){
                break;
            }
            bird.style.marginTop = birdtopmargin + "vh";
            birdtopmargin = birdtopmargin - 0.5;
        }
    }
    down();
}

async function down(){
    if(interruption == false){
        interruption = true;
        while(birdtopmargin <= 75){
            await sleep(speed/500);
            birdtopmargin = birdtopmargin + 0.2;
            bird.style.marginTop = birdtopmargin + "vh";
        }
        interruption = false;
    }
    else{
        return;
    }
}

function score(){
    currentscore++;
    let scoreboard = document.getElementById("score");
    scoreboard.innerHTML = "Score:" + currentscore;
}

async function check(i){
    let wall = document.getElementById("wall" + i);
    let innerwall = document.getElementById("innerwall" + i);
    while(true) {
        if(wallinterruption){
            // wallinterruption = false;
            bg.removeChild(wall);
        }
        let styles = getComputedStyle(wall);
        let birdstyles = getComputedStyle(bird);
        let innerwallstyles = getComputedStyle(innerwall);
        let wallleftmargin = parseInt(styles.marginLeft.split("p")[0]);
        await sleep(1);
        if(wallleftmargin >= 30 && wallleftmargin <= 90){
            let birdmargin = parseInt(birdstyles.marginTop.split("p")[0]);
            let birdheight = parseInt(birdstyles.height.split("p")[0]);
            let wallmargin = parseInt(innerwallstyles.marginTop.split("p")[0]);
            let wallgap = parseInt(innerwallstyles.height.split("p")[0]);
            if(birdmargin < wallmargin || (birdheight + birdmargin) > (wallmargin + wallgap)){
                console.log("gameover");
                gameover();
                break;
            }
        }
        if(wallleftmargin <= 30){
            break;
        }
    }
    score();
}

function gameover(){
    document.getElementById("footer").innerHTML = "Tap/Space To Restart";
    let str = document.createElement("h1")
    str.innerHTML = "GAME OVER!<br>" + "Your Score: " + currentscore;
    str.id = "gameover";
    str.style.visibility = "visible";
    bg.appendChild(str);
    wallinterruption = true;
    interruption = true;
    dead = true;
    running = false;
    currentscore = 0;
}

function level(i){
    if((i+1)%5 == 0 && speed > 2500){
        speed = speed - 200;
    }
}

function restart(){
    if(dead == true){
        dead = false;
        location.reload();
    }
}
