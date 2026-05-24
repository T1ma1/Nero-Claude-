import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

const canvas = document.getElementById('galaxy-canvas');
if (!canvas) throw new Error('No galaxy canvas');

const scene = new THREE.Scene();

const parameters = {
    count: 70000,
    size: 0.008,
    radius: 2.15,
    branches: 3,
    spin: 3,
    randomness: 5,
    randomnessPower: 4,
    insideColor: '#8a7340',
    outsideColor: '#1a1208'
};

let material, geometry, points;

const generateGalaxy = () => {
    if (points) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.pow(Math.random() * parameters.randomness, Math.random() * parameters.radius);
        const spinAngle = radius * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
        const neg = [1, -1];
        const rx = Math.pow(Math.random(), parameters.randomnessPower) * neg[Math.floor(Math.random() * 2)];
        const ry = Math.pow(Math.random(), parameters.randomnessPower) * neg[Math.floor(Math.random() * 2)];
        const rz = Math.pow(Math.random(), parameters.randomnessPower) * neg[Math.floor(Math.random() * 2)];

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + rx;
        positions[i3 + 1] = ry;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz;

        const mc = colorInside.clone();
        mc.lerp(colorOutside, Math.random() * radius / parameters.radius);
        colors[i3] = mc.r;
        colors[i3 + 1] = mc.g;
        colors[i3 + 2] = mc.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 3, 3);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

const clock = new THREE.Clock();
const tick = () => {
    const t = clock.getElapsedTime();
    const scrollOffset = scrollY * 0.001;

    camera.position.x = Math.cos(t * 0.05 + scrollOffset) * 3;
    camera.position.z = Math.sin(t * 0.05 + scrollOffset) * 3;
    camera.position.y = 3 - scrollOffset * 0.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();
