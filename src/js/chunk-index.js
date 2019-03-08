import $ from "jquery";
// import  {TweenMax}  from "gsap/TweenMax";
// import ScrollMagic from 'scrollmagic';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';




export default function indexInit () {
  
    
    // scrollAnimation();
}


class Circle {
  constructor(x,y,radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.originalRadius = radius;
    this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();

    
  }

  update() {
    if(this.x + radius > canvas.width || this.x - radius < 0) {
      this.dx = -this.dx;
    }
    if(this.y + radius > canvas.height || this.y - radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    if(this.x - mouse.x < 40 && this.x - mouse.x > -40 && this.y - mouse.y < 40 && this.y - mouse.y > -40 && this.radius < 40) {
      this.radius += 1;
    } else if (this.radius > this.originalRadius) {
      this.radius-=1;
    }
    this.draw();
  }
}

var colorArray = [
  "#2B3542",
  "#305854",
  "#558A84",
  "#F0CFC4",
  "#D8726B",
]
var canvas = document.createElement('canvas')
canvas.setAttribute("id", "canvas")
canvas.height=window.innerHeight;
canvas.width=window.innerWidth;
document.body.append(canvas)
var ctx = canvas.getContext("2d");


var mouse = {
  x : undefined,
  y : undefined
}
canvas.addEventListener("mousemove", function(event){
  mouse.x = event.x;
  mouse.y = event.y;
})

window.addEventListener("resize", function() {
  canvas.height=window.innerHeight;
  canvas.width=window.innerWidth;
})

canvas.addEventListener('touchmove', function(e) {
  // Cache the client X/Y coordinates
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, false);
canvas.addEventListener('touchend', function(e) {
  // Cache the client X/Y coordinates
  mouse.x = undefined;
  mouse.y = undefined;
}, false);


var circleArray = [];
for(var i =0; i<500; i++) {
  var radius = Math.random() * 4 + 1;
  var x = Math.random() * (canvas.width - radius*2) + radius;
  var y = Math.random() * (canvas.height - radius*2) + radius;
  var dx = Math.random() - 0.5;
  var dy = Math.random() - 0.5;
  circleArray.push(new Circle(x, y, radius, dx, dy));
}

console.log(circleArray)
animate();

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i = 0; i<circleArray.length; i++) {
    circleArray[i].update();
  }
}




