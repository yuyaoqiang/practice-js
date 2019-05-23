;(function(global,factory){
  if(typeof define === "function" && (define.amd || define.cmd)){
    define(factory);
  }else{
    global.Drag = factory();
  }
}(this,function(){
  `use strict`;
  let Drag = function(ele,options){
    if(!ele) return;
    options = options || {edge:{}}
    options.edge={
      left:parseInt(options.edge.left,10)||0,
      top:parseInt(options.edge.top,10)||0,
      right:parseInt(options.edge.right,10)||0,
      bottom:parseInt(options.edge.bottom,10)||0,
    }
    let data = {
      distanceX:0,
      distanceY:0
    }
    let [winWidth,winHeight] = [window.innerWidth,window.innerHeight];
    let translateFn=function(x,y){
      x = Math.round(1000*x)/1000;
      y = Math.round(1000*y)/1000;
      ele.style.webkitTransform = `translate(${[x+'px',y+'px'].join(',')})`;
      ele.style.transform = `translate3d(${[x+'px',y+'px',0].join(',')})`;
    } 
    ele.addEventListener('touchstart',(event)=>{
        let events = event.touches[0] || event;
        data.posX = events.pageX;
        data.posY = events.pageY;
        data.touching = true;
        ele.distanceX ? data.distanceX = ele.distanceX : "";
        ele.distanceY ? data.distanceY = ele.distanceY : "";
        data.bound = ele.getBoundingClientRect();
    })
    ele.addEventListener('touchmove',(event)=>{
        if(!data.touching) return;
        event.preventDefault();
        let events = event.touches[0] || event;
        data.nowX = events.pageX;
        data.nowY = events.pageY;
        let distanceX = data.nowX - data.posX,
            distanceY = data.nowY - data.posY;
        let absLeft = data.bound.left + distanceX,
            absTop = data.bound.top + distanceY,
            absRight = absLeft + data.bound.width,
            absBottom = absTop + data.bound.height;
        if(absLeft < options.edge.left){
          distanceX =distanceX - absLeft + options.edge.left;
        }
        if(absTop < options.edge.top){
          distanceY = distanceY - absTop + options.edge.top;
        }
        if(absRight > (winWidth - options.edge.right)){
          distanceX = distanceX - (absRight - winWidth + options.edge.right);
        }
        if(absBottom >(winHeight - options.edge.bottom)){
          distanceY = distanceY - (absBottom - winHeight + options.edge.bottom);
        }
        let x = data.distanceX + distanceX,
            y = data.distanceY + distanceY;
        translateFn(x,y);
        ele.distanceX = x;
        ele.distanceY = y;
    })
    ele.addEventListener('touchend',()=>{
      data.touching = false;
    })
  }
  return Drag;
}))