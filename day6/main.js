//定义 canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = 1000;
let height = canvas.height = 1000;
let rand = function(a,b){return ~~((Math.random()*(b-a+1))+1)};
let dTor = function(degrees){return degrees *  (Math.PI /180)};
//定义对象
let circle = {
  x: (width/2),
  y: (height/2),
  radius:90,
  speed:4,
  rotation:0,
  angleStart : 270,
  angleEnd : 90,
  hue:220,
  thickness:18,
  blur:25
}
//闪光
let particle = [];
let particleMax = 100;
let createParticles= function(){
  if(particle.length < particleMax){
    particle.push({
      x: (circle.x + circle.radius * Math.cos(dTor(circle.rotation-85))) + (rand(0, circle.thickness*2) - circle.thickness),
      y: (circle.y + circle.radius * Math.sin(dTor(circle.rotation-85))) + (rand(0, circle.thickness*2) - circle.thickness),
      vx: (rand(0, 100)-50)/1000,
      vy: (rand(0, 100)-50)/1000,
      radius: rand(1, 6)/2,
      alpha: rand(10, 20)/100
    });
  }
}
let updateParticles = function(){
  let i = particle.length;
  while(i--){
    let p = particle[i];
    p.vx +=(rand(0,100)-50)/750;
    p.vy +=(rand(0,100)-50)/750;
    p.x +=p.vx;
    p.y +=p.vy;
    p.alpha -=.01;
    if(p.alpha<.02){
      particle.splice(i,1);
    }
  }
}
let renderParticles = function(){
  let i  = particle.length;
  while(i--){
    let p = particle[i];
    ctx.beginPath();
    ctx.fillRect(p.x,p.y,p.radius,p.radius);
    ctx.closePath();
    ctx.fillStyle = `hsla(0,0%,100%,${p.alpha})`
  }
}
//执行方法
updateCircle = function(){
  if(circle.rotation <360){
    circle.rotation+=circle.speed;
  }else{
    circle.rotation = 0;
  }
}
let renderCircle = function(){
  ctx.save();
  ctx.translate(circle.x,circle.y);
  ctx.rotate(dTor(circle.rotation));
  ctx.beginPath();
  ctx.arc(0,0,circle.radius,dTor(circle.angleStart),dTor(circle.angleEnd),true);
  ctx.lineWidth = circle.thickness;    
  ctx.strokeStyle = gradient1;
  ctx.stroke();
  ctx.restore();
}
let renderCircleBorder = function(){
  ctx.save();
  ctx.translate(circle.x,circle.y);
  ctx.rotate(dTor(circle.rotation));
  ctx.beginPath();
  ctx.arc(0,0,circle.radius + (circle.thickness/2),dTor(circle.angleStart),dTor(circle.angleEnd),true);
  ctx.lineWidth = 2;
  ctx.strokeStyle =gradient2;
  ctx.stroke();
  ctx.restore();
}
let renderCircleFlare = function(){
  ctx.save();
  ctx.translate(circle.x,circle.y);
  ctx.rotate(dTor(circle.rotation+185));
  ctx.scale(1,1);
  ctx.beginPath();
  ctx.arc(0,circle.radius,30,0,Math.PI * 2, false);
  ctx.closePath();
  let gradient3 = ctx.createRadialGradient(0,circle.radius,0,0,circle.radius,30);
  gradient3.addColorStop(0, 'hsla(330, 50%, 50%, .35)');
  gradient3.addColorStop(1, 'hsla(330, 50%, 50%, 0)');
  ctx.fillStyle =gradient3;
  ctx.fill();
  ctx.restore();
}
let renderCircleFlare2 =function(){
  ctx.save();
  ctx.translate(circle.x,circle.y);
  ctx.rotate(dTor(circle.rotation+165));
  ctx.scale(1.5,1);
  ctx.beginPath();
  ctx.arc(0,circle.radius,25,0,Math.PI * 2,false);
  ctx.closePath();
  var gradient4 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 25);
  gradient4.addColorStop(0, 'hsla(30, 100%, 50%, .2)');
  gradient4.addColorStop(1, 'hsla(30, 100%, 50%, 0)');
  ctx.fillStyle = gradient4;
  ctx.fill();     
  ctx.restore();
}
let clear = function(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, .2)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';		
}
let loop =function(){
  clear();
  updateCircle();
  renderCircle();
  renderCircleBorder();
  renderCircleFlare();
  renderCircleFlare2();
  createParticles();
  updateParticles();
  renderParticles();
}
//渐变
ctx.shadowBlur = circle.blur;
ctx.shadowColor = `hsla(${circle.hue},80%,60%,1)`;
ctx.lineCap = "round";
var gradient1 = ctx.createLinearGradient(0,-circle.radius,0,circle.radius);
gradient1.addColorStop(0,`hsla(${circle.hue},60%,50%,.25)`);
gradient1.addColorStop(1,`hsla(${circle.hue},60%,50%,0)`);

var gradient2 = ctx.createLinearGradient(0,-circle.radius,0,circle.radius);
gradient2.addColorStop(0, 'hsla('+circle.hue+', 100%, 50%, 0)');
gradient2.addColorStop(.1, 'hsla('+circle.hue+', 100%, 100%, .7)');
gradient2.addColorStop(1, 'hsla('+circle.hue+', 100%, 50%, 0)');


setInterval(loop,20);