//board

let board;
let boardWidth=window.innerWidth;
let boardHeight=window.innerHeight;
let context;

//bird

let birdWidth= 34;  //width/height ratio= 408/228=17/12
let birdHeight=24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
x : birdX,
y : birdY,
width : birdWidth,
height : birdHeight
}

//pipes
let pipeArray=[];
let pipeWidth=64;//height/width ratio = 384/3072=1/8
let pipeHeight=512;
let pipeX= boardWidth;
let pipeY= 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;
let gameOver = false;
let score = 0;

window.onload = function(){
    console.log("yy");
    let restartButton = document.getElementById("restartButton");
    restartButton.style.top = `${Math.floor(boardHeight/10)}px`;
    restartButton.style.right = `${Math.floor(boardWidth/10)}px`;

    
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x,bird.y,bird.width, bird.height);

    //load images
    birdImg=new Image();
    birdImg.src="./flappybird.png";
    birdImg.onload = function(){
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImg= new Image();
    topPipeImg.src="toppipe.png" ;

    bottomPipeImg= new Image();
    bottomPipeImg.src ="bottompipe.png ";

    requestAnimationFrame(update);
    setInterval(placePipes, 1700); //every 2 secs
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
    document.addEventListener("keydown", triggerReload);


}
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height );
        if(bird.y > board.height){
            gameOver = true;
        }


    //pipes
    for(let i = 0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; // coz there r 2 pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
      pipeArray.shift() ;  // removes first element from the array 
    }
    //score
    context.fillStyle = "white";
    context.font = `${Math.floor(boardHeight*0.1)}px Arial `;
    context.fillText(score, boardWidth/10, boardHeight/6);

    if(gameOver){

        if (boardWidth>650){
        context.font = `${Math.floor(boardHeight*0.15)}px Arial`;
        }
        else{
            context.font = `${Math.floor(boardHeight*0.05)}px Arial`;
        }
        const textWidth= context.measureText("GAME OVER").width;
        context.fillText("GAME OVER",boardWidth/2-textWidth/2, boardHeight/2);
    }
    // if (gameOver) {
    //     context.fillStyle ="white";
    //     if (score < 90) {
           
    //       context.font = "100px Arial"; // Set a larger font size if s < 90
    //     } else {
    //       context.font = "80px Arial"; // Set a smaller font size otherwise
    //     }
      
    //     // Assuming 'x' and 'y' are appropriate coordinates for the text
    //     context.fillText("GAME OVER", boardWidth/2-boardWidth/4, boardHeight/2);
    //   }   
      
      
      
   
}
function placePipes(){
    if(gameOver){
        return;
    }
    //(0-1)* pipeHeight/2
    //0-> -128 (pipeHeight/4)
    //1-> -128 - 256 (pipeHeight/4 - pipe/2) = -3/4 pipeHeight
    let randomPipeY= pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace= board.height/4;
    
    let topPipe={
    img : topPipeImg,
    x : pipeX,
    y :  randomPipeY,
    width : pipeWidth,
    height : pipeHeight,
    passed: false
}
pipeArray.push(topPipe);

let bottomPipe= {
    img : bottomPipeImg,
    x : pipeX,
    y : randomPipeY + pipeHeight + openingSpace,
    width : pipeWidth,
    height : pipeHeight,
    passed : false,

}
pipeArray.push(bottomPipe);
}
function moveBird(e) {

    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type == "touchstart"){
        //jump
        velocityY= -6;

        //reset
        if(gameOver){
            bird.y= birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;

        }
    }
}
function detectCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width >b.x &&
    a.y < b.y+b.height &&
    a.y + a.height>b.y ;
}
function reload(){
    location.reload();

}

let triggerReload=(e)=>{
    if (e.code == "KeyZ"){
    reload()
    }

}



