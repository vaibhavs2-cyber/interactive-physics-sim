# Interactive Browser-Based Physics Simulator

An open-source, interactive web application featuring four distinct physics simulation modules. I have built this application using vanilla JavaScript and the HTML5 Canvas API. This tool removes setup friction, allowing us to manipulate physical variables in real-time.

## 🚀 Live Deployment
** https://interactive-physics-sim.vercel.app/ **

## ✨ Features
* **Zero-Installation:** It runs directly in any modern web browser.
* **Responsive Parameter Controls:** It has dynamic sliders for velocity, angle, wavelength, and stiffness.
* **Real-Time Data Readout:** It features live tracking of kinematics, energy states, and orbital velocity.
* **Physics-Accurate Canvas Animation:** It is a custom-built physics engine running at >= 60 FPS.
* **Aesthetic UI:** Portrayed a minimalist dark mode with fading trajectory trails and wave interference overlays.

## 🔬 Simulation Modules & Physics Notes

### 1. Projectile Motion
Models 2D kinematics under constant downward acceleration.
* **Equations:** $v = u + at$ and $s = ut + \frac{1}{2}at^2$
* **Interactive:** Adjust initial velocity ($v_0$) and launch angle ($\theta$).

### 2. Planetary Orbit Simulator
Simulates Newtonian gravity in two dimensions between a central mass and an orbiting body.
* **Equations:** Universal Gravitation $F = G \frac{m_1 m_2}{r^2}$ 
* **Mechanics:** Resolves gravitational force into X and Y acceleration vectors continuously.

### 3. Simple Harmonic Oscillator
Demonstrates a continuous restoring force using a block attached to a spring.
* **Equations:** Hooke's Law $F = -kx$
* **Interactive:** Adjust the initial amplitude stretch and the spring stiffness constant ($k$).

### 4. Double-Slit Interference
Visualizes wave optics and the superposition of expanding wavefronts.
* **Mechanics:** Overlaps two point sources to visually demonstrate zones of constructive and destructive interference using screen composite rendering.
* **Interactive:** Adjust the wavelength ($\lambda$) and the distance between the two slits ($d$).

## 💻 Tech Stack
* **Frontend Structure:** HTML5 & CSS3
* **Physics Engine & Animation:** Vanilla JavaScript (`requestAnimationFrame`, Canvas 2D API)
* **Build Tool:** Vite

## 📸 Screenshots
![alt text](<Minimalist Beauty Photo Collage Instagram Portrait Post.png>)
![alt text](<Minimalist Beauty Photo Collage Instagram Portrait Post (1).png>)