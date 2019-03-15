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
    
    if(this.y + this.radius + this.dy > window.innerHeight) {
      this.dy = -this.dy * friction;
    } else {
      this.dy += gravity*delta;
    }
    if(this.x + this.radius + this.dx > window.innerWidth || this.x - this.radius + this.dx < 0 ) {
      this.dx = -this.dx;
    }
    this.x += this.dx*delta;
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
var gravity = 0.06;
var friction = 0.87;
var mouse = {
  x : undefined,
  y : undefined
}

var animationFrame;
var ballArray = [];


var pixelRatio = window.devicePixelRatio || 1;
var canvas = document.createElement('canvas');
canvas.setAttribute("id", "canvas");
canvas.height=window.innerHeight * pixelRatio;
canvas.width=window.innerWidth * pixelRatio;
document.body.append(canvas);
var ctx = canvas.getContext("2d");

ctx.scale(pixelRatio, pixelRatio);


window.addEventListener("mousemove", function(event){
  mouse.x = event.x;
  mouse.y = event.y;
})

window.addEventListener("resize", function() {
  canvas.height=window.innerHeight * pixelRatio;
  canvas.width=window.innerWidth * pixelRatio;
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
      var dx = (Math.random()*0.24)-0.12;
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
    var dx = (Math.random()*0.24)-0.12;
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
    var x = randomInt(0, window.innerWidth - radius - radius) + radius;
    var y = randomInt(0, window.innerHeight - radius);
    var dx = (Math.random()*0.24)-0.12;
    var dy = randomInt(-2, 2);
    var color = colorArray[randomInt(0,colorArray.length-1)];
    ballArray.push(new Ball(x, y, radius, dx, dy, color));
  }
  requestAnimationFrame(animate);
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max-min+1) +min)
}



var delta = 0;
var lastRanTime = 0;
var timestep = 1000/60;
var loopPerSecound;
var lastLogTime = 0;
var cornerLength = 50 ;
var i = 0;
var j = 0;
var fontSize = 20;

function animate(timestamp) {

  
  lastLogTime == 0 ? lastLogTime = timestamp : null;
  delta += timestamp - lastRanTime;
  if(timestamp - lastLogTime >= 300) {
    loopPerSecound = Math.floor(1000 / (timestamp - lastRanTime));
    lastLogTime = timestamp;
  }

  lastRanTime = timestamp;



  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  
  ctx.beginPath();
  ctx.moveTo(0, cornerLength);
  ctx.lineTo(0, 0);
  ctx.lineTo(cornerLength, 0);
  ctx.moveTo(window.innerWidth-cornerLength, 0);
  ctx.lineTo(window.innerWidth, 0);
  ctx.lineTo(window.innerWidth, cornerLength);
  ctx.moveTo(window.innerWidth-cornerLength, window.innerHeight);
  ctx.lineTo(window.innerWidth, window.innerHeight);
  ctx.lineTo(window.innerWidth, window.innerHeight-cornerLength);
  ctx.moveTo(0, window.innerHeight-cornerLength);
  ctx.lineTo(0, window.innerHeight);
  ctx.lineTo(cornerLength, window.innerHeight);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "red";
  ctx.stroke();


  
  while(delta >= timestep) {
    for(i=0; i<ballArray.length;i++) {
      ballArray[i].update(delta);
    }
    delta -= timestep;
  }

  

  for(j=0; j<ballArray.length;j++) {
    ballArray[j].draw();
  }
  
  
  ctx.font = `${fontSize}px times`;
  ctx.fillStyle = "#333";
  ctx.fillText(canvas.width, 20, 20);
  ctx.fillText(canvas.height, 20, 40);
  ctx.fillText(window.innerWidth, 20, 60);
  ctx.fillText(window.innerHeight, 20, 80);
  ctx.fillText(pixelRatio, 20, 100);
  ctx.fillText(ballArray.length, 20, 120);
  ctx.fillText(loopPerSecound, 20, 140);


  animationFrame = requestAnimationFrame(animate);
}




