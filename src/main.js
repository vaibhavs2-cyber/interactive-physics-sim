const canvas = document.getElementById('physics-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 

const gravity = 9.8; 
const timeStep = 0.016; 

const velSlider = document.getElementById('velocity-slider');
const angleSlider = document.getElementById('angle-slider');
const velDisplay = document.getElementById('vel-display');
const angleDisplay = document.getElementById('angle-display');
const fireBtn = document.getElementById('fire-btn');
const readout = document.getElementById('data-readout');

const label1 = velSlider.previousElementSibling;
const label2 = angleSlider.previousElementSibling;

let currentSim = 'projectile'; 
const btnProj = document.getElementById('btn-projectile');
const btnOrbit = document.getElementById('btn-orbit');
const btnOscillator = document.getElementById('btn-oscillator');
const btnDoubleSlit = document.getElementById('btn-doubleslit'); // NEW BUTTON

// ---------------------------------------------------------
// SIMULATION 1: PROJECTILE MOTION
// ---------------------------------------------------------
class Projectile {
    constructor(x, y, v0, angle) {
        this.startX = x; this.startY = y;
        this.x = x; this.y = y;
        const rad = angle * (Math.PI / 180);
        this.vx = v0 * Math.cos(rad); this.vy = -v0 * Math.sin(rad); 
        this.radius = 10; this.color = '#ff4757'; 
        this.timeElapsed = 0; this.isFlying = true; this.history = []; 
    }
    update() {
        if (this.y >= this.startY && this.timeElapsed > 0) {
            this.isFlying = false; this.y = this.startY; return;
        }
        if (this.isFlying) {
            if (this.timeElapsed % (timeStep * 3) < timeStep) this.history.push({x: this.x, y: this.y});
            this.vy += gravity * timeStep * 10; 
            this.x += this.vx * timeStep * 10; this.y += this.vy * timeStep * 10;
            this.timeElapsed += timeStep;
        }
    }
    draw() {
        if (this.history.length > 0) {
            ctx.beginPath(); ctx.moveTo(this.startX, this.startY);
            for (let pos of this.history) ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = 'rgba(255, 71, 87, 0.4)'; ctx.lineWidth = 3; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.fill(); ctx.closePath();
    }
}

// ---------------------------------------------------------
// SIMULATION 2: PLANETARY ORBIT
// ---------------------------------------------------------
class Planet {
    constructor(x, y, vx, vy) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.radius = 8; this.color = '#1e90ff'; this.history = [];
    }
    update(sunX, sunY, sunMass) {
        let dx = sunX - this.x; let dy = sunY - this.y;
        let distSq = dx * dx + dy * dy; let distance = Math.sqrt(distSq);
        let force = sunMass / distSq; 
        this.vx += force * (dx / distance); this.vy += force * (dy / distance);
        this.x += this.vx; this.y += this.vy;
        this.history.push({x: this.x, y: this.y});
        if (this.history.length > 200) this.history.shift(); 
    }
    draw() {
        if (this.history.length > 1) {
            ctx.beginPath(); ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let pos of this.history) ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = 'rgba(30, 144, 255, 0.3)'; ctx.lineWidth = 2; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.fill(); ctx.closePath();
    }
}

// ---------------------------------------------------------
// SIMULATION 3: HARMONIC OSCILLATOR
// ---------------------------------------------------------
class Oscillator {
    constructor(anchorX, anchorY, amplitude, stiffness) {
        this.anchorX = anchorX; this.anchorY = anchorY; this.restLength = 200;
        this.x = anchorX + this.restLength + amplitude; this.y = anchorY; this.vx = 0;
        this.mass = 10; this.stiffness = stiffness / 1000; this.damping = 0.999; 
    }
    update() {
        let displacement = this.x - (this.anchorX + this.restLength);
        let force = -this.stiffness * displacement;
        this.vx += force / this.mass; this.vx *= this.damping; this.x += this.vx;
    }
    draw() {
        ctx.beginPath(); ctx.moveTo(this.anchorX, this.anchorY);
        let coils = 15; let coilWidth = (this.x - this.anchorX) / coils;
        for (let i = 0; i < coils; i++) {
            let cx = this.anchorX + i * coilWidth;
            let cy = this.anchorY + (i % 2 === 0 ? 20 : -20);
            if (i === 0) cy = this.anchorY; 
            ctx.lineTo(cx, cy);
        }
        ctx.lineTo(this.x, this.anchorY);
        ctx.strokeStyle = '#aaaaaa'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#2ed573'; ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
        ctx.fillStyle = '#555'; ctx.fillRect(this.anchorX - 10, this.anchorY - 50, 10, 100);
    }
}

// ---------------------------------------------------------
// SIMULATION 4: DOUBLE-SLIT INTERFERENCE
// ---------------------------------------------------------
class WaveInterference {
    constructor(wavelength, slitDistance) {
        this.wavelength = wavelength;
        this.slitDistance = slitDistance;
        this.time = 0; // Phase driver
        this.sourceY = canvas.height * 0.1; // Slits are near the top
    }

    update() {
        this.time += 0.5; // Controls the speed of outward wave propagation
    }

    draw() {
        const centerX = canvas.width / 2;
        const s1x = centerX - (this.slitDistance / 2);
        const s2x = centerX + (this.slitDistance / 2);

        // Draw the barrier and slits
        ctx.fillStyle = '#444';
        ctx.fillRect(0, this.sourceY - 5, s1x - 10, 10); // Left wall
        ctx.fillRect(s1x + 10, this.sourceY - 5, this.slitDistance - 20, 10); // Center wall
        ctx.fillRect(s2x + 10, this.sourceY - 5, canvas.width - s2x, 10); // Right wall

        // Draw expanding wavefronts (concentric circles)
        // We use screen composite mode to make intersecting waves glow brighter
        ctx.globalCompositeOperation = 'screen';
        ctx.strokeStyle = 'rgba(156, 136, 255, 0.2)'; // Ethereal purple
        ctx.lineWidth = 2;

        let maxRadius = Math.max(canvas.width, canvas.height);
        
        for (let r = (this.time % this.wavelength); r < maxRadius; r += this.wavelength) {
            if (r > 0) {
                // Wave from Slit 1
                ctx.beginPath();
                ctx.arc(s1x, this.sourceY, r, 0, Math.PI);
                ctx.stroke();

                // Wave from Slit 2
                ctx.beginPath();
                ctx.arc(s2x, this.sourceY, r, 0, Math.PI);
                ctx.stroke();
            }
        }
        // Reset composite operation so UI draws normally
        ctx.globalCompositeOperation = 'source-over'; 
    }
}

// ---------------------------------------------------------
// INITIALIZATION & EVENT LISTENERS
// ---------------------------------------------------------
let ball = new Projectile(50, canvas.height - 50, 70, 60);
const sunX = window.innerWidth * 0.75 / 2; const sunY = window.innerHeight / 2; const sunMass = 5000; 
let earth = new Planet(sunX, sunY - 200, 4.5, 0); 
let spring = new Oscillator(100, canvas.height / 2, 100, 50);
let waves = new WaveInterference(20, 100);

function updateUIForSim() {
    if (currentSim === 'projectile') {
        label1.innerHTML = `Velocity: <span id="vel-display">${velSlider.value}</span> m/s`;
        label2.innerHTML = `Angle: <span id="angle-display">${angleSlider.value}</span>°`;
        fireBtn.innerText = "Fire Projectile";
        velSlider.min = 10; velSlider.max = 150; angleSlider.min = 0; angleSlider.max = 90;
    } else if (currentSim === 'orbit') {
        label1.innerHTML = `(Orbital mechanics are self-sustaining)`;
        label2.innerHTML = ``;
        fireBtn.innerText = "Reset Orbit";
    } else if (currentSim === 'oscillator') {
        label1.innerHTML = `Start Stretch: <span id="vel-display">${velSlider.value}</span> px`;
        label2.innerHTML = `Spring Stiffness: <span id="angle-display">${angleSlider.value}</span>`;
        fireBtn.innerText = "Release Spring";
        velSlider.min = 10; velSlider.max = 200; angleSlider.min = 10; angleSlider.max = 100;
    } else if (currentSim === 'doubleslit') {
        label1.innerHTML = `Wavelength (λ): <span id="vel-display">${velSlider.value}</span> px`;
        label2.innerHTML = `Slit Separation (d): <span id="angle-display">${angleSlider.value}</span> px`;
        fireBtn.innerText = "Generate Waves";
        velSlider.min = 10; velSlider.max = 60; velSlider.value = 20;
        angleSlider.min = 30; angleSlider.max = 300; angleSlider.value = 100;
    }
}

btnProj.addEventListener('click', () => { currentSim = 'projectile'; updateUIForSim(); });
btnOrbit.addEventListener('click', () => { currentSim = 'orbit'; earth = new Planet(sunX, sunY - 200, 4.5, 0); updateUIForSim(); });
btnOscillator.addEventListener('click', () => { currentSim = 'oscillator'; updateUIForSim(); });
btnDoubleSlit.addEventListener('click', () => { currentSim = 'doubleslit'; updateUIForSim(); });

velSlider.addEventListener('input', (e) => {
    let span = label1.querySelector('span'); if (span) span.innerText = e.target.value;
    if (currentSim === 'doubleslit') waves.wavelength = Number(e.target.value);
});
angleSlider.addEventListener('input', (e) => {
    let span = label2.querySelector('span'); if (span) span.innerText = e.target.value;
    if (currentSim === 'doubleslit') waves.slitDistance = Number(e.target.value);
});

fireBtn.addEventListener('click', () => {
    if (currentSim === 'projectile') ball = new Projectile(50, canvas.height - 50, Number(velSlider.value), Number(angleSlider.value));
    else if (currentSim === 'orbit') earth = new Planet(sunX, sunY - 200, 4.5, 0);
    else if (currentSim === 'oscillator') spring = new Oscillator(100, canvas.height / 2, Number(velSlider.value), Number(angleSlider.value));
    else if (currentSim === 'doubleslit') waves = new WaveInterference(Number(velSlider.value), Number(angleSlider.value));
});

// ---------------------------------------------------------
// MASTER ANIMATION LOOP
// ---------------------------------------------------------
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentSim === 'projectile') {
        ball.update(); ball.draw();
        let displayY = Math.max(0, (ball.startY - ball.y) / 10).toFixed(2);
        let displayX = ((ball.x - ball.startX) / 10).toFixed(2);
        readout.innerHTML = `Time: ${ball.timeElapsed.toFixed(2)} s<br>Height: ${displayY} m<br>Range: ${displayX} m`;
    } 
    else if (currentSim === 'orbit') {
        ctx.beginPath(); ctx.arc(sunX, sunY, 30, 0, Math.PI * 2); ctx.fillStyle = '#ffcc00'; ctx.shadowBlur = 50; ctx.shadowColor = '#ffcc00'; ctx.fill(); ctx.shadowBlur = 0; ctx.closePath();
        earth.update(sunX, sunY, sunMass); earth.draw();
        let currentVelocity = Math.sqrt(earth.vx * earth.vx + earth.vy * earth.vy).toFixed(2);
        readout.innerHTML = `Central Mass: ${sunMass} units<br>Orbital Vel: ${currentVelocity} m/s`;
    }
    else if (currentSim === 'oscillator') {
        spring.update(); spring.draw();
        let currentDisplacement = (spring.x - (spring.anchorX + spring.restLength)).toFixed(2);
        let kineticEnergy = (0.5 * spring.mass * spring.vx * spring.vx).toFixed(2);
        readout.innerHTML = `Displacement: ${currentDisplacement} px<br>Kinetic Energy: ${kineticEnergy} J`;
    }
    else if (currentSim === 'doubleslit') {
        waves.update(); waves.draw();
        // Calculates approximate phase difference conceptually
        let maxFringes = Math.floor(waves.slitDistance / waves.wavelength);
        readout.innerHTML = `Wavelength (λ): ${waves.wavelength} px<br>Slit Sep (d): ${waves.slitDistance} px<br>Max Fringes (m): ~${maxFringes}`;
    }

    requestAnimationFrame(animate);
}

updateUIForSim();
animate();