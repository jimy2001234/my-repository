// Fondo estrellado
const canvas = document.getElementById('stars');
const ctx = canvas.getContext("2d"); 
let stars = [];


function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.3 + 0.2,
    speed: Math.random() * 0.4 + 0.1
  });
}

function animateStars() {
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// Scroll reveal
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const winHeight = window.innerHeight;
    if (top < winHeight - 100) el.classList.add("active");
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Interactividad con sonido y apilado
const stack = document.querySelectorAll("#gallery .block");
const sound = document.getElementById('clickSound');

function updateStackOrder() {
  stack.forEach((block, i) => {
    block.classList.remove('stack-1', 'stack-2', 'stack-3', 'stack-4', 'stack-5',);
    block.classList.add(`stack-${i + 1}`);
  });
}
updateStackOrder();

stack.forEach((block) => {
  block.addEventListener("click", () => {
    const parent = block.parentNode;
    parent.removeChild(block);
    parent.insertBefore(block, parent.firstChild); // mueve al frente
    updateStackOrder();

    // Reproduce sonido
    sound.currentTime = 0;
    sound.play();
  });
});


