var PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();

function setupCanvas(canvas) {
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  canvas.width = window.innerWidth * 1;
  canvas.height = window.innerHeight * 1;

  var context = canvas.getContext('2d');
  // context.scale(PIXEL_RATIO, PIXEL_RATIO)
  return context;
}

var canvas = document.querySelector("#scene"),
  ctx = setupCanvas(canvas),
  particles = [],
  amount = 0,
  mouse = {
    x: 0,
    y: 0
  },
  radius = 1;

var colors = ["#FFFFFF", "#98a5ab", "#789fbb", "#dbd3c2", "#eeefde"];

const TEXT = 'Save the Date';

var ww = canvas.width / PIXEL_RATIO; // = window.innerWidth;
var wh = canvas.height / PIXEL_RATIO; // = window.innerHeight;

function Particle(x, y) {
  this.x = Math.random() * ww;
  this.y = Math.random() * wh;
  this.dest = {
    x: x,
    y: y
  };
  this.r = Math.random() * 2 + 2;
  this.vx = (Math.random() - 0.5) * 20;
  this.vy = (Math.random() - 0.5) * 20;
  this.accX = 0;
  this.accY = 0;
  this.friction = 0.9;

  this.color = colors[Math.floor(Math.random() * 6)];
}

Particle.prototype.render = function () {
  this.accX = (this.dest.x - this.x) / 200;
  this.accY = (this.dest.y - this.y) / 200;
  this.vx += this.accX;
  this.vy += this.accY;
  this.vx *= this.friction;
  this.vy *= this.friction;

  this.x += this.vx;
  this.y += this.vy;

  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt(a * a + b * b);
  if (distance < (radius * 70)) {
    this.accX = (this.x - mouse.x) / 100;
    this.accY = (this.y - mouse.y) / 100;
    this.vx += this.accX;
    this.vy += this.accY;
  }

}

function onMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onTouchMove(e) {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}

function onTouchEnd(e) {
  mouse.x = -9999;
  mouse.y = -9999;
}

function initScene() {
  setupCanvas(canvas);
  ww = window.innerWidth;
  wh = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var fz = (ww / 10);

  ctx.font = "bold " + fz + "px 'Dancing Script', cursive";
  ctx.textAlign = "center";

  if (ww < 480) {
    fz *= 2;
    var lineheight = fz * 1.1;
    var lines = TEXT.split(' ');
    ctx.font = "bold " + fz + "px 'Dancing Script', cursive";

    for (var i = 0; i < lines.length; i++)
      ctx.fillText(lines[i], (ww / 2), (wh / 2) - 175 + (i * lineheight));
    fz = (ww / 3.5);
  } else
    ctx.fillText(TEXT, ww / 2, wh / 2);
  var data = ctx.getImageData(0, 0, ww, wh).data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "screen";

  particles = [];
  for (var i = 0; i < ww; i += Math.round(fz / 25)) {
    for (var j = 0; j < wh; j += Math.round(fz / 25)) {
      if (data[((i + j * ww) * 4) + 3] > 250) {
        particles.push(new Particle(i, j));
      }
    }
  }
  amount = particles.length;

}

function onMouseClick() {
  radius++;
  if (radius === 5) {
    radius = 0;
  }
}

function render(a) {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < amount; i++) {
    particles[i].render();
  }
};

// copy.addEventListener("keyup", initScene);
window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("touchend", onTouchEnd);

window.onload = function () {
  console.log('loaded');

  initScene();
  requestAnimationFrame(render);
}