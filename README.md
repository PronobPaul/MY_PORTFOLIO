# Three.js 3D Hero Section

## Run it locally
1. Install Visual Studio Code.
2. Open this `threejs-hero-3d` folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` → **Open with Live Server**.
5. Keep internet enabled: Three.js is loaded from jsDelivr CDN.

Do not open `index.html` by double-clicking it. Browsers can block local image/module loading; use a local server.

## Personalize
- Replace `assets/profile.png` with your own transparent PNG (keep the same filename).
- Edit your name, intro, and links in `index.html`.
- Change colors and layout in `style.css`.
- Change 3D geometry, lights, animation, and mouse tilt in `script.js`.

## What is happening?
- `Scene`: the 3D world.
- `PerspectiveCamera`: the viewer looking into that world.
- `WebGLRenderer`: draws the scene to the canvas.
- `Mesh`: a 3D object made from geometry and material.
- `TextureLoader`: loads your portrait image.
- `requestAnimationFrame`: repeats the animation smoothly.
