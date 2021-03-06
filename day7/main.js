
function Star(id,x,y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = Math.floor(Math.random())+1;
  let alpha =(Math.floor(Math.random()*10)+1);
  this.color = `rgba(255,255,255,${alpha})`;
}
Star.prototype.draw = function(){
  ctx.fillStyle = this.color;
  ctx.shadowBlur = this.r;
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false);
  ctx.closePath();
  ctx.fill();
}
Star.prototype.move = function(){
  this.y -=.15;
  if(this.y<=-10){this.y =HEIGHT+10};
  this.draw();
}
Star.prototype.die = function(){}

function Dot(id,x,y){
  this.id =id;
  this.x = x;
  this.y = y;
  this.r = Math.floor(Math.random()*10);
  this.maxLinks = 2; 
  this.speed = .5;
  this.a = .5;
  this.aReduction = .005;
  this.color = `rgba(255,255,255,${this.a})`;
  this.linkColor =`rgba(255,255,255,${this.a/4})`
  this.dir =Math.floor(Math.random()*200)
}
Dot.prototype.draw=function(){
  ctx.fillStyle = this.color;
  ctx.shadowBlur = this.r * 2;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
}
Dot.prototype.link = function(){
  if(this.id === 0 ) return;
  let previousDot1 = getPreviousDot(this.id,1);
  let previousDot2 = getPreviousDot(this.id,2);
  let previousDot3 = getPreviousDot(this.id,3);
  if(!previousDot1) return;
  ctx.strokeStyle = this.linkColor;
  ctx.moveTo(previousDot1.x,previousDot1.y);
  ctx.beginPath();
  ctx.lineTo(this.x,this.y);
  console.log(previousDot2)
  if(previousDot2 !== false){ 
     ctx.lineTo(previousDot2.x,previousDot2.y)} ;
  if(previousDot3 !== false) ctx.lineTo(previousDot3.x,previousDot3.y);
  ctx.stroke();
  ctx.closePath();
}
Dot.prototype.move = function(){
  this.a -=this.aReduction;
  if(this.a <=0){
    this.die();
    return;
  }
  this.color = `rgba(255,255,255,${this.a})`;
  this.linkColor = `rgba(255,255,255,${this.a/4})`;
  this.x = this.x + Math.cos(degTored(this.dir))*this.speed;
  this.y = this.y + Math.sin(degTored(this.dir))*this.speed;
  this.draw();
  this.link();
}
Dot.prototype.die = function(){
  dots[this.id] = null;
  delete dots[this.id];
}
function degTored(deg){
  return deg * (Math.PI / 180 )
}
function getPreviousDot(id,stepback){
  if (id == 0 || id - stepback < 0) return false;
  if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
  else return false;
}
window.onmousemove =function(e){
  mouseMoving =true;
  mouseX = e.clientX;
  mouseY = e.clientY;
  clearInterval(mouseMoveChecker);
  mouseMoveChecker = setTimeout(function(){
    mouseMoving = false;
  },100)
}
function drawIfMouseMoving(){
  if(!mouseMoving) return;
  if(dots.length===0){
    dots[0] = new Dot(0,mouseX,mouseY);
    dots[0].draw();
    return;
  }
  let previousDot = getPreviousDot(dots.length,1);
  let prevX = previousDot.x;
  let prevY = previousDot.y;

  let diffX = Math.abs(prevX - mouseX);
  let diffY = Math.abs(prevY - mouseY);
  if(diffX < dotsMinDist || diffY < dotsMinDist) return;
  let xVariation = Math.random()>.5 ? -1 : 1;
  xVariation = xVariation * Math.floor(Math.random()*maxDistFromCursor)+1;
  let yVariation = Math.random()>.5 ? -1 : 1;
  yVariation = yVariation * Math.floor(Math.random()*maxDistFromCursor)+1;
  dots[dots.length] = new Dot(dots.length,mouseX+xVariation,mouseY+yVariation);
  dots[dots.length-1].draw();
  dots[dots.length-1].link();
}
let canvas = document.getElementById("canvas");
let ctx =canvas.getContext("2d");
let WIDTH;
let HEIGHT;
let mouseMoving =false;
let mouseMoveChecker;
let mouseX;
let mouseY;
let stars = [];
let initStarsPopulation = 80;
let dots =[];
let dotsMinDist = 2;
let maxDistFromCursor = 50;

setCanvasSize();
init();
function setCanvasSize(){
  WIDTH = document.documentElement.clientWidth;
  HEIGHT = document.documentElement.clientHeight;
  canvas.setAttribute("width",WIDTH);
  canvas.setAttribute("height",HEIGHT);
}
function init (){
  ctx.strokeStyle = "white";
  ctx.shadowColor = "white";
  for(let i = 0; i<initStarsPopulation;i++){
    stars[i] = new Star(i,Math.floor(Math.random()*WIDTH),Math.floor(Math.random()*HEIGHT));
  }
  ctx.shadowBlur = 0;
  animate();
}
function animate() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    for (var i in stars) {
      stars[i].move();
    }
    for(var i in dots){
      dots[i].move();
    }
    drawIfMouseMoving();
    requestAnimationFrame(animate);
}

