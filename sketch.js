var bg,bgImg,brick,brickImg,ground,groundImg,coin,coinImg;
var mario,marioAnim,obstacle,obstacleAnim, goomba,goombaAnim;
var restart, restartImg,gameOver, gameOverImg;
var marioCollided, marioCollidedImg;
var dieSound,chkPointSound,jumpSound;
var brickGroup,obstacleGroup, coinGroup;
var invisibleGoomba;
var score=0;
var highScore;
const PLAY=1;
const END=0;
var gameState=PLAY;

function preload()
{
  bgImg=loadImage("bg.png");
  brickImg=loadImage("brick.png");
  groundImg=loadImage("ground2.png");
  coinImg=loadImage("coin1.png");
  
  marioAnim=loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  obstacleAnim=loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  goombaAnim=loadAnimation("goomba1.png","goomba2.png","goomba3.png");
  
  restartImg=loadImage("restart.png");
  gameOverImg=loadImage("gameOver.png");
  
  marioCollidedImg=loadAnimation("collided.png");
  
  dieSound=loadSound("die.mp3");
  chkPointSound=loadSound("checkPoint.mp3");
  jumpSound=loadSound("jump.mp3");
  
  brickGroup=new Group();
  obstacleGroup=new Group();
  coinGroup=new Group();
}

function setup()
{
  createCanvas(600,400);
  bg=createSprite(300,200);
  bg.addImage("bg",bgImg);
  
  ground=createSprite(600,350);
  ground.addImage("ground",groundImg);
  ground.x=ground.width/2;
  ground.velocityX=-8;
  
  ground.setCollider("rectangle",0,0,ground.width,72);
  //ground.debug=true;
  
  mario=createSprite(50,276);  
  mario.addAnimation("mario",marioAnim);
  mario.addAnimation("collided",marioCollidedImg);
  mario.scale=2;
  
  restart=createSprite(300,230);
  restart.addImage("restart",restartImg);
  restart.scale=0.4;
  restart.visible=false;
  
  gameOver=createSprite(300,150);
  gameOver.addImage("gameover",gameOverImg);
  gameOver.scale=0.4;
  gameOver.visible=false;

  goomba=createSprite(625,280);
  goomba.addAnimation("goomba",goombaAnim);
  invisibleGoomba=createSprite(625,280-goomba.height/2-20,goomba.width-10,5);
  invisibleGoomba.visible=false;
  
  
}

function draw()
{
  if (localStorage.getItem("marioScore"))
      localStorage.setItem("marioScore",highScore);
  else
      highScore=0;
  if(gameState==PLAY)
  {
    //restart.visible=false;
    //gameOver.visible=false;
    if(ground.x<0)
      {
        ground.x=ground.width/2;
      }
      //console.log(mario.y);
      if(keyDown("space") && mario.y>275)
      {
        mario.velocityY=-12;
        jumpSound.play();
      }
      mario.velocityY=mario.velocityY+0.5;
      

      spawnBricks();
      spawnCoins();
      spawnObstacles();
      spawnGoomba();

      brickGroup.collide(mario,breakBricks);
      coinGroup.collide(mario, getCoins);
      obstacleGroup.collide(mario,endMario);
      
      
      if(goomba.x<-10)
      {
        goomba.x=625;
        goomba.velocityX=0;
        invisibleGoomba.x=625;
        invisibleGoomba.velocityX=0;
      }
      if(invisibleGoomba.isTouching(mario))
      {
        console.log("invisible goomba touching mario");
        goomba.velocityX=-20;
        invisibleGoomba.velocityX=-20;
        score=score+5;
      }
      else
       if(goomba.isTouching(mario))
       {
        console.log("Visible goomba touching mario");
         endMario(goomba,mario);
       }
      
  }
  console.log(gameState);
  if(gameState===END)
  {
      restart.visible=true;
      gameOver.visible=true;
//      console.log("in END");
      ground.velocityX=0;
      obstacleGroup.collide(ground);
      obstacleGroup.setLifetimeEach(-1);
      brickGroup.setLifetimeEach(-1);
      coinGroup.setLifetimeEach(-1);
      obstacleGroup.setVelocityXEach(0);
      brickGroup.setVelocityXEach(0);
      coinGroupo.setVelocityXEach(0);

      if(mousePressedOver(restart))
      { 
        
        reset();
      }
  }
      mario.collide(ground);
      drawSprites();
      scoreBoard();
      if(score%5===0)
      {
        chkPointSound.play();
      }

}

function spawnBricks()
{
  var rand;
  rand=Math.round(random(100,200));
  if(frameCount%40 === 0)
  {
    brick=createSprite(605,rand,10,10);
    brick.addImage(brickImg);
    brick.scale=1;
    brick.velocityX=-8;
    brick.lifetime=75;
    mario.depth=brick.depth+1;
    brickGroup.add(brick);
  } 
}

function spawnObstacles()
{
  
  if(frameCount%240 === 0)
  {
    obstacle=createSprite(605,280);
    obstacle.addAnimation("obstacle",obstacleAnim);
    obstacle.scale=1;
    obstacle.velocityX=-8;
    obstacle.lifetime=150;
    obstacleGroup.add(obstacle);
  }
}

function spawnGoomba()
{
  var rand=Math.round(random(1,2));
  if(frameCount%180 === 0)
  {
    console.log("Rand:"+rand);
    if(rand===1)
    { 
      goomba.velocityX=-8;
      invisibleGoomba.velocityX=-8;
    }
  }
}

function breakBricks(thisBrick, callb)
{
  //text("+100",a.x,a.y);
  //console.log(typeOf callb);
  thisBrick.destroy();
  score=score+2; 
  
  
}

function getCoins(thisCoin, callb)
{
  //text("+100",a.x,a.y);
  //console.log(typeOf callb);
  thisCoin.destroy();
  score=score+1; 
  
  
}

function endMario(thisObstacle,mar)
{
   mario.changeAnimation("collided",marioCollidedImg);
   mario.velocityY=0;
  mario.y=276;
  //mario.y=26;
   gameState=END;
   dieSound.play();
  //console.log("end Monkey");
  //thisObstacle.y=380;
  thisObstacle.collide(ground);
  //monk.velocityX=0;
  //monk.velocityY=0;
  //monkey.scale=monkey.scale*.75;
  //thisObstacle.destroy();
}

function spawnCoins()
{
  var rand;
  rand=Math.round(random(50,230));
  if(frameCount%30 === 0)
  {
    coin=createSprite(605,rand,100,100);
    coin.addImage(coinImg);
    coin.scale=0.05;
    coin.velocityX=-8;
    coin.lifetime=75;
    mario.depth=coin.depth+1;
    coinGroup.add(coin);
  } 

}

function scoreBoard()
{
  
  stroke("black");
  fill("black");
  textSize(15);
  text("Score: "+score,500,40); 
  text("HighScore: "+highScore,350,40);
}

function reset()
{
  gameState=PLAY;
  restart.visible=false;
  gameOver.visible=false;
  
  obstacleGroup.destroyEach();
  brickGroup.destroyEach();
  
  mario.changeAnimation("mario",marioAnim);
  ground.velocityX=-8;
  if(highScore<score)
     localStorage.setItem("marioScore",score);
  score=0;
}
