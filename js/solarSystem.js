//Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import * as TWEEN from "https://unpkg.com/@tweenjs/tween.js@18.6.4/dist/tween.esm.js";

//////////////////////////////////////
//NOTE Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE texture loader
const textureLoader = new THREE.TextureLoader();
//////////////////////////////////////

//////////////////////////////////////
//NOTE import all texture
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");
//////////////////////////////////////

//////////////////////////////////////
//NOTE Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////

//////////////////////////////////////
//NOTE screen bg
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.setPath('./image/skybox/').load([
  'space_rt.png', // +X (right)
  'space_lf.png', // -X (left)
  'space_up.png', // +Y (top)
  'space_dn.png', // -Y (bottom)
  'space_ft.png', // +Z (front)
  'space_bk.png', // -Z (back)
]);
scene.background = cubeTexture;

//////////////////////////////////////

//////////////////////////////////////
//NOTE Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);



camera.position.set(-50, 90, 150);
////////////////////////////////////

//////////////////////////////////////
//NOTE Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  // Calculate points for the circular path
  const numSegments = 100; // Number of segments to create the circular path
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}
//////////////////////////////////////

/////////////////////////////////////
//NOTE: create planet
const genratePlanet = (size, planetTexture, x, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);

  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
  };
};

const planets = [
  {
    ...genratePlanet(3.2, mercuryTexture, 28),
    rotaing_speed_around_sun: 0.004,
    self_rotation_speed: 0.004,
  },
  {
    ...genratePlanet(5.8, venusTexture, 44),
    rotaing_speed_around_sun: 0.015,
    self_rotation_speed: 0.002,
  },
  {
    ...genratePlanet(6, earthTexture, 62),
    rotaing_speed_around_sun: 0.01,
    self_rotation_speed: 0.02,
  },
  {
    ...genratePlanet(4, marsTexture, 78),
    rotaing_speed_around_sun: 0.008,
    self_rotation_speed: 0.018,
  },
  {
    ...genratePlanet(12, jupiterTexture, 100),
    rotaing_speed_around_sun: 0.002,
    self_rotation_speed: 0.04,
  },
  {
    ...genratePlanet(10, saturnTexture, 138, {
      innerRadius: 10,
      outerRadius: 20,
      ringmat: saturnRingTexture,
    }),
    rotaing_speed_around_sun: 0.0009,
    self_rotation_speed: 0.038,
  },
  {
    ...genratePlanet(7, uranusTexture, 176, {
      innerRadius: 7,
      outerRadius: 12,
      ringmat: uranusRingTexture,
    }),
    rotaing_speed_around_sun: 0.0004,
    self_rotation_speed: 0.03,
  },
  {
    ...genratePlanet(7, neptuneTexture, 200),
    rotaing_speed_around_sun: 0.0001,
    self_rotation_speed: 0.032,
  },
];


// Tooltip
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.backgroundColor = "rgba(0,0,0,0.7)";
tooltip.style.color = "#fff";
tooltip.style.padding = "5px 10px";
tooltip.style.display = "none";
tooltip.style.pointerEvents = "none";
tooltip.style.borderRadius = "5px";
tooltip.style.fontSize = "14px";
tooltip.style.zIndex = "1";
document.body.appendChild(tooltip);

// Raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(planets.map(p => p.planet));
  if (intersects.length > 0) {
    const planetIndex = planets.findIndex(p => p.planet === intersects[0].object);
    const names = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
    tooltip.innerText = names[planetIndex];
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;
    tooltip.style.display = "block";
  } else {
    tooltip.style.display = "none";
  }
});

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.planet));

  if (intersects.length > 0) {
    const clickedPlanet = intersects[0].object;
    const planetPosition = clickedPlanet.getWorldPosition(new THREE.Vector3());
    const offset = 20;

    // Move camera smoothly
    const targetPos = {
      x: planetPosition.x + offset,
      y: planetPosition.y + offset,
      z: planetPosition.z + offset,
    };

    // Smooth transition
    new TWEEN.Tween(camera.position)
      .to(targetPos, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
  }
});


//////////////////////////////////////

//////////////////////////////////////
//NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  speed: 1,
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms")*1
gui.add(options, "speed", 0, maxSpeed?maxSpeed:20);


const speedControlsContainer = document.createElement("div");
speedControlsContainer.style.position = "absolute";
speedControlsContainer.style.top = "60px";
speedControlsContainer.style.left = "10px";
speedControlsContainer.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
speedControlsContainer.style.padding = "10px";
speedControlsContainer.style.borderRadius = "8px";
speedControlsContainer.style.color = "white";
speedControlsContainer.style.zIndex = 2;
speedControlsContainer.style.maxWidth = "200px";
speedControlsContainer.style.fontSize = "13px";
document.body.appendChild(speedControlsContainer);

const planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

planets.forEach((planetObj, index) => {
  const label = document.createElement("label");
  label.innerText = `${planetNames[index]} speed`;
  label.style.display = "block";
  label.style.marginTop = "8px";

  const input = document.createElement("input");
  input.type = "range";
  input.min = "0";
  input.max = "0.02";
  input.step = "0.0001";
  input.value = planetObj.rotaing_speed_around_sun;

  input.addEventListener("input", (e) => {
    planetObj.rotaing_speed_around_sun = parseFloat(e.target.value);
  });

  speedControlsContainer.appendChild(label);
  speedControlsContainer.appendChild(input);
});


//////////////////////////////////////

//////////////////////////////////////
//NOTE - animate function
function animate(time) {
  if (!isPaused) {
    sun.rotateY(options.speed * 0.004);
    planets.forEach(
      ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
        planetObj.rotateY(options.speed * rotaing_speed_around_sun);
        planet.rotateY(options.speed * self_rotation_speed);
      }
    );
  }

  TWEEN.update(time);
  renderer.render(scene, camera);
}




let isPaused = false;

const pauseBtn = document.createElement("button");
pauseBtn.innerText = "Pause";
pauseBtn.style.position = "absolute";
pauseBtn.style.top = "10px";
pauseBtn.style.left = "10px";
pauseBtn.style.padding = "10px 20px";
pauseBtn.style.zIndex = 1;
pauseBtn.style.background = "#222";
pauseBtn.style.color = "white";
pauseBtn.style.border = "none";
pauseBtn.style.cursor = "pointer";
document.body.appendChild(pauseBtn);

pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.innerText = isPaused ? "Resume" : "Pause";
});

renderer.setAnimationLoop(animate);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//////////////////////////////////////
