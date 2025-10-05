// ----------------------------
// Fondo 3D con esferas luminosas (Three.js)
// ----------------------------
const container = document.getElementById("bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 200;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio || 1);
container.appendChild(renderer.domElement);

// Luz ambiental y direccional para dar brillo
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff66ff, 0.6);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Esferas luminosas
const particlesCount = 200;
const spheres = [];
const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xff66ff,
  emissive: 0x00ffff,
  emissiveIntensity: 1.2,
  roughness: 0.4,
  metalness: 0.3,
});

for (let i = 0; i < particlesCount; i++) {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(
    (Math.random() - 0.5) * 600,
    (Math.random() - 0.5) * 600,
    (Math.random() - 0.5) * 600
  );
  scene.add(sphere);
  spheres.push(sphere);
}

// Líneas entre esferas
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xcc00ff,
  transparent: true,
  opacity: 0.4,
});
const lineGeometry = new THREE.BufferGeometry();
const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lineMesh);

function updateLines() {
  const linePositions = [];
  for (let i = 0; i < spheres.length; i++) {
    const a = spheres[i].position;
    for (let j = i + 1; j < spheres.length; j++) {
      const b = spheres[j].position;
      const dist = a.distanceTo(b);
      if (dist < 90) {
        linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
  }
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(linePositions), 3)
  );
  lineGeometry.computeBoundingSphere();
}

function animate() {
  requestAnimationFrame(animate);
  spheres.forEach((sphere) => {
    sphere.position.x += (Math.random() - 0.5) * 0.3;
    sphere.position.y += (Math.random() - 0.5) * 0.3;
    sphere.position.z += (Math.random() - 0.5) * 0.3;
  });
  updateLines();
  scene.rotation.y += 0.0008;
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
  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    const winHeight = window.innerHeight;
    if (top < winHeight - 100) el.classList.add("active");
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ----------------------------
// Interactividad con bloques
// ----------------------------
const gallery = document.getElementById("gallery");
const sound = document.getElementById("clickSound");

gallery.addEventListener("click", (e) => {
  const block = e.target.closest(".block");
  if (!block) return;

  gallery
    .querySelectorAll(".block")
    .forEach((b) => b.classList.remove("active"));
  block.classList.add("active");

  try {
    sound.currentTime = 0;
    sound.play();
  } catch (err) {}
});
