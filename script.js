// ----------------------------
// Fondo 3D: red de partículas conectadas (Three.js)
// ----------------------------
const container = document.getElementById("bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 200;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio || 1);
container.appendChild(renderer.domElement);

// Partículas
const particlesCount = 300;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 600;
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
const points = new THREE.Points(geometry, material);
scene.add(points);

// Líneas entre partículas cercanas
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.35 });
const lineGeometry = new THREE.BufferGeometry();
const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lineMesh);

function updateLines() {
  const pos = points.geometry.attributes.position.array;
  const linePositions = [];
  for (let i = 0; i < particlesCount; i++) {
    const ix = i * 3;
    for (let j = i + 1; j < particlesCount; j++) {
      const jx = j * 3;
      const dx = pos[ix] - pos[jx];
      const dy = pos[ix + 1] - pos[jx + 1];
      const dz = pos[ix + 2] - pos[jx + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 70) {
        linePositions.push(
          pos[ix], pos[ix + 1], pos[ix + 2],
          pos[jx], pos[jx + 1], pos[jx + 2]
        );
      }
    }
  }
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  lineGeometry.computeBoundingSphere();
}

function animateParticles() {
  const pos = points.geometry.attributes.position.array;
  for (let i = 0; i < pos.length; i++) {
    pos[i] += (Math.random() - 0.5) * 0.2;
  }
  points.geometry.attributes.position.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);
  points.rotation.y += 0.0009;
  points.rotation.x += 0.0004;
  animateParticles();
  updateLines();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ----------------------------
// Scroll reveal
// ----------------------------
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

// ----------------------------
// Interactividad con bloques separados
// ----------------------------
const gallery = document.getElementById('gallery');
const sound = document.getElementById('clickSound');

gallery.addEventListener('click', (e) => {
  const block = e.target.closest('.block');
  if (!block) return;

  // Quitar active de todos
  gallery.querySelectorAll('.block').forEach(b => b.classList.remove('active'));

  // Activar el clickeado
  block.classList.add('active');

  // Sonido
  try {
    sound.currentTime = 0;
    sound.play();
  } catch (err) {
    // autoplay bloqueado, ignorar
  }
});
