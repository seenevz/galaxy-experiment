import './style.css';
import {
  BufferGeometry,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
  Points,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
const galaxyParams = {
  count: 1000,
  size: 0.02,
};
// Debug
const gui = new dat.GUI();
gui.add(galaxyParams, 'count').min(100).max(1000000).step(100);
gui.add(galaxyParams, 'size').min(0.001).max(0.1).step(0.001);
// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!;

// Scene
const scene = new Scene();

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

/**
 * Galaxy
 */

const generateGalaxy = () => {
  const geometry = new BufferGeometry();
  const material = new PointsMaterial({
    size: galaxyParams.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const positions = new Float32Array(galaxyParams.count * 3);

  for (let i = 0; i < galaxyParams.count; i++) {
    const i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * 3;
    positions[i3 + 1] = (Math.random() - 0.5) * 3;
    positions[i3 + 2] = (Math.random() - 0.5) * 3;
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const points = new Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
