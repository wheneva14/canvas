import $ from "jquery";
// import  {TweenMax}  from "gsap/TweenMax";
// import ScrollMagic from 'scrollmagic';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';




export default function indexInit () {
  
    init();
}


class Ball {
  constructor(x,y,radius, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.stroke();
    
    
  }

  update(delta) {
    if(this.y + this.radius + this.dy > canvasLogicalHeight) {
      this.dy = -this.dy * friction;
    } else {
      this.dy += gravity;
    }
    if(this.x + this.radius + this.dx > canvasLogicalWidth || this.x - this.radius + this.dx < 0 ) {
      this.dx = -this.dx;
    }
    this.x += this.dx;
    this.y += this.dy;

  }

  set(x,y,dx,dy) {
    x ? this.x = x : null;
    y ? this.y = y : null;
    dx ? this.dx = dx : null;
    dy ? this.dy = dy : null;
  }
}



var colorArray = [
  "#2B3542",
  "#305854",
  "#558A84",
  "#F0CFC4",
  "#D8726B",
]
var gravity = 1;
var friction = 0.87;
var mouse = {
  x : undefined,
  y : undefined
}

var animationFrame;
var ballArray = [];

var canvasReal = document.createElement('canvas');
var pixelRatio = window.devicePixelRatio || 1;
var canvas = document.createElement('canvas');
canvasReal.setAttribute("id", "canvas");
canvas.height=window.innerHeight * pixelRatio;
canvas.width=window.innerWidth * pixelRatio;
canvasReal.height=window.innerHeight * pixelRatio;
canvasReal.width=window.innerWidth * pixelRatio;
document.body.append(canvasReal);
var ctx = canvas.getContext("2d");
var ctxReal = canvasReal.getContext("2d");
var canvasLogicalWidth = document.getElementById("canvas").clientWidth;
var canvasLogicalHeight = document.getElementById("canvas").clientHeight;

ctx.scale(pixelRatio, pixelRatio);


window.addEventListener("mousemove", function(event){
  mouse.x = event.x;
  mouse.y = event.y;
})

window.addEventListener("resize", function() {
  canvas.height=window.innerHeight * pixelRatio;
  canvas.width=window.innerWidth * pixelRatio;
  canvasLogicalWidth = document.getElementById("canvas").clientWidth;
  canvasLogicalHeight = document.getElementById("canvas").clientHeight;
  ctx.scale(pixelRatio, pixelRatio);
  init();
})

window.addEventListener('touchmove', function(e) {
  // Cache the client X/Y coordinates
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, false);
window.addEventListener('touchend', function(e) {
  // Cache the client X/Y coordinates
  mouse.x = undefined;
  mouse.y = undefined;

  clearInterval(spawnId);
}, false);


var spawnId;
window.addEventListener("mousedown", function(event) {
 
    spawnId = setInterval(function() {
      var radius = randomInt(8, 20);
      var x = mouse.x;
      var y = mouse.y;
      var dx = randomInt(-2, 2);
      var dy = randomInt(-2, 2);
      var color = colorArray[randomInt(0,colorArray.length-1)];
      ballArray.push(new Ball(x, y, radius, dx, dy, color));

    }, 40)
      
  
})
window.addEventListener("mouseup", function() {
  clearInterval(spawnId);
})

window.addEventListener("touchstart", function() {
  spawnId = setInterval(function() {
    var radius = randomInt(8, 20);
    var x = mouse.x;
    var y = mouse.y;
    var dx = randomInt(-2, 2);
    var dy = randomInt(-2, 2);
    var color = colorArray[randomInt(0,colorArray.length-1)];
    ballArray.push(new Ball(x, y, radius, dx, dy, color));
  }, 40)
})


function init() {
  cancelAnimationFrame(animationFrame);
  ballArray = [];
  for( var i = 0; i<0 ; i++) {
    var radius = randomInt(8, 20);
    var x = randomInt(0, canvasLogicalWidth - radius - radius) + radius;
    var y = randomInt(0, canvasLogicalHeight - radius);
    var dx = randomInt(-2, 2);
    var dy = randomInt(-2, 2);
    var color = colorArray[randomInt(0,colorArray.length-1)];
    ballArray.push(new Ball(x, y, radius, dx, dy, color));
  }
  requestAnimationFrame(animate);
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max-min+1) +min)
}

// var lastCalledTime;
// var fps;
// var diff;

var delta = 0;
var lastRanTime = 0;
var timestep = 1000/60;
var loopPerSecound;
var lastLogTime = 0;
function animate(timestamp) {

  
  lastLogTime == 0 ? lastLogTime = timestamp : null;
  delta += timestamp - lastRanTime;
  if(timestamp - lastLogTime >= 300) {
    loopPerSecound = Math.floor(1000 / (timestamp - lastRanTime));
    lastLogTime = timestamp;
  }

  lastRanTime = timestamp;
  // if(!lastCalledTime) {
  //   lastCalledTime = Date.now();
  //   fps = 0;
  // } else {
  //   diff = (Date.now() - lastCalledTime)/1000;
  //   lastCalledTime = Date.now();
  //   fps = Math.round(1/diff);
  // }



  ctx.clearRect(0, 0, canvasLogicalWidth, canvasLogicalHeight);
  ctxReal.clearRect(0, 0, canvasReal.width, canvasReal.height);

  var cornerLength = 50 ;
  ctx.beginPath();
  ctx.moveTo(0, cornerLength);
  ctx.lineTo(0, 0);
  ctx.lineTo(cornerLength, 0);
  ctx.moveTo(canvasLogicalWidth-cornerLength, 0);
  ctx.lineTo(canvasLogicalWidth, 0);
  ctx.lineTo(canvasLogicalWidth, cornerLength);
  ctx.moveTo(canvasLogicalWidth-cornerLength, canvasLogicalHeight);
  ctx.lineTo(canvasLogicalWidth, canvasLogicalHeight);
  ctx.lineTo(canvasLogicalWidth, canvasLogicalHeight-cornerLength);
  ctx.moveTo(0, canvasLogicalHeight-cornerLength);
  ctx.lineTo(0, canvasLogicalHeight);
  ctx.lineTo(cornerLength, canvasLogicalHeight);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "red";
  ctx.stroke();

  while(delta >= timestep) {
    for(var i=0; i<ballArray.length;i++) {
      ballArray[i].update(delta);
    }
    delta -= timestep;
  }

  for(var i=0; i<ballArray.length;i++) {
    ballArray[i].draw();
  }
  
  var fontSize = 20;
  ctx.font = `${fontSize}px times`;
  ctx.fillStyle = "#333";
  ctx.fillText(canvas.width, 20, 20);
  ctx.fillText(canvas.height, 20, 40);
  ctx.fillText(canvasLogicalWidth, 20, 60);
  ctx.fillText(canvasLogicalHeight, 20, 80);
  ctx.fillText(pixelRatio, 20, 100);
  ctx.fillText(ballArray.length, 20, 120);
  ctx.fillText(loopPerSecound, 20, 140);


  ctxReal.drawImage(canvas,0 ,0);
  animationFrame = requestAnimationFrame(animate);
}




