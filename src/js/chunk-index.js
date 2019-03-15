import $ from "jquery";
// import  {TweenMax}  from "gsap/TweenMax";
// import ScrollMagic from 'scrollmagic';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';




export default function indexInit () {
  
    init();
}


class Ball {
  constructor(x,y,radius) {
    this.x = x;
    this.y = y;
    this.dx = (Math.random()*0.24)-0.12;
    this.dy = (Math.random()*0.24)-0.12;
    this.radius = radius;
    this.color = colorArray[randomInt(0,colorArray.length-1)];
    this.mass = 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    // ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.stroke();
    
    
  }

  update(delta) {
    
    for(let i = 0 ; i< ballArray.length; i++ ) {
      if(this === ballArray[i]) {
        continue;
      }
      if(getDistance(this.x, this.y, ballArray[i].x, ballArray[i].y) < this.radius+ballArray[i].radius) {
        resolveCollision(this, ballArray[i]);
      }
    }

    if(this.x+this.radius > window.innerWidth || this.x-this.radius < 0) {
      this.dx = -this.dx;
    }
    if(this.y+this.radius > window.innerHeight || this.y-this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx*delta;
    this.y += this.dy*delta;
    // if(this.y + this.radius + this.dy > window.innerHeight) {
    //   this.dy = -this.dy * friction;
    // } else {
    //   this.dy += gravity*delta;
    // }
    // if(this.x + this.radius + this.dx > window.innerWidth || this.x - this.radius + this.dx < 0 ) {
    //   this.dx = -this.dx;
    // }
    // this.x += this.dx*delta;
    // this.y += this.dy;

  }

  
}


function init() {
  cancelAnimationFrame(animationFrame);
  ballArray = [];
  for( var i = 0; i<2 ; i++) {
    var radius = randomInt(200, 220);
    var x = randomInt(0, window.innerWidth - radius - radius) + radius;
    var y = randomInt(0, window.innerHeight - radius - radius) + radius;
    

    if(i>0) {
      for (let j =0; j<ballArray.length; j++) {
        if(getDistance(x,y,ballArray[j].x,ballArray[j].y) < radius+ballArray[j].radius) {
          x = randomInt(0, window.innerWidth - radius - radius) + radius;
          y = randomInt(0, window.innerHeight - radius - radius) + radius;
          j = -1;
        }
      }
    }

    ballArray.push(new Ball(x, y, radius));
  }
  requestAnimationFrame(animate);
}



function rotate(velocity, angle) {
  const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}


function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // Grab angle between the two colliding particles
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
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

  // clearInterval(spawnId);
}, false);

function getDistance(x1, y1, x2, y2) {
  let xTotal = x1-x2;
  let yTotal = y1-y2;

  return ((xTotal*xTotal)+(yTotal*yTotal))**(1/2);
}
var spawnId;
window.addEventListener("mousedown", function(event) {
 
    // spawnId = setInterval(function() {
    //   var radius = randomInt(8, 20);
    //   var x = mouse.x;
    //   var y = mouse.y;
    //   var dx = (Math.random()*0.24)-0.12;
    //   var dy = randomInt(-2, 2);
    //   var color = colorArray[randomInt(0,colorArray.length-1)];
    //   ballArray.push(new Ball(x, y, radius, dx, dy, color));

    // }, 40)
      
  
})
window.addEventListener("mouseup", function() {
  // clearInterval(spawnId);
})

window.addEventListener("touchstart", function() {
  // spawnId = setInterval(function() {
  //   var radius = randomInt(8, 20);
  //   var x = mouse.x;
  //   var y = mouse.y;
  //   var dx = (Math.random()*0.24)-0.12;
  //   var dy = randomInt(-2, 2);
  //   var color = colorArray[randomInt(0,colorArray.length-1)];
  //   ballArray.push(new Ball(x, y, radius, dx, dy, color));
  // }, 40)
})





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

  ballArray.forEach(function(element) {
    element.draw();
  })

  // for(j=0; j<ballArray.length;j++) {
  //   ballArray[j].draw();
  // }
  
  
  
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




