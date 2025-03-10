// Three.js Starry Background with Parallax Effect
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
const velocities = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 150;
    posArray[i + 1] = (Math.random() - 0.5) * 150;
    posArray[i + 2] = (Math.random() - 0.5) * 150;
    velocities[i] = (Math.random() - 0.5) * 0.02;
    velocities[i + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i + 2] = (Math.random() - 0.5) * 0.02;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    color: 0xf5f5f5,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
camera.position.z = 50;

// Enhanced mouse interaction with parallax effect
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) / 100;
    mouseY = (e.clientY - windowHalfY) / 100;
});

// Parallax scrolling effect
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

function animate() {
    requestAnimationFrame(animate);

    // Smooth camera movement for parallax effect
    targetX = mouseX * 0.3;
    targetY = mouseY * 0.3;

    // Apply parallax effect based on scroll position
    camera.position.y = -(scrollY * 0.01);

    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        if (positions[i] > 75 || positions[i] < -75) velocities[i] *= -1;
        if (positions[i + 1] > 75 || positions[i + 1] < -75) velocities[i + 1] *= -1;
        if (positions[i + 2] > 75 || positions[i + 2] < -75) velocities[i + 2] *= -1;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Enhanced particle rotation with smoother movement
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;
    particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Name Animation
const name = document.querySelector('.name-3d');
const letters = name.textContent.split('');
name.textContent = '';
letters.forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter === ' ' ? '\u00A0' : letter;
    span.style.transitionDelay = `${index * 0.1}s`;
    name.appendChild(span);
    setTimeout(() => span.classList.add('animate'), 100);
});

// Navigation
const nav = document.querySelector('nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        window.scrollTo({
            top: targetSection.offsetTop - 100,
            behavior: 'smooth'
        });
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Add section visibility animation
const sections = document.querySelectorAll('section');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once the animation is done, stop observing
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Projects Redirection to GitHub
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const githubUrl = card.getAttribute('data-github');
        if (githubUrl) {
            window.open(githubUrl, '_blank');
        }
    });
});

// Enhanced hover effects for buttons and links
document.querySelectorAll('.cta-button, .read-more, .nav-link, .social-link').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    element.addEventListener('mouseleave', () => {
        element.style.transition = 'all 0.3s ease';
    });
});