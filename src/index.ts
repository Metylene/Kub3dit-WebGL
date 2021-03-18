import './style.css';
import * as THREE from "three";

const canvas = document.querySelector('#c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});

const scene = new THREE.Scene();
scene.background = new THREE.Color("lightblue");

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-10, 20, -10);

renderer.render(scene, camera);