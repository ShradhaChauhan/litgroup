// Premium Apple-Level Three.js Animated Background - Subtle & Elegant
class HeroBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lightSweep = null;
    this.spotlight = null;
    this.animationId = null;
    this.time = 0;

    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Create renderer with optimized settings
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // Transparent background

    // Style the canvas
    const canvas = this.renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';

    this.container.appendChild(canvas);

    // Create subtle animated elements
    this.createLightSweep();
    this.createSpotlightGlow();

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());

    // Start animation
    this.animate();
  }

  // Slow horizontal parallax light sweep
  createLightSweep() {
    const geometry = new THREE.PlaneGeometry(30, 30);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          
          // Slow horizontal sweep (very subtle)
          float sweep = sin(time * 0.15 + uv.x * 2.0) * 0.5 + 0.5;
          
          // Soft gradient from center
          float dist = distance(uv, vec2(0.5, 0.5));
          float gradient = 1.0 - smoothstep(0.0, 0.8, dist);
          
          // Combine for subtle light movement - t4h style minimal
          float intensity = gradient * sweep * 0.04;
          
          // Very subtle neutral colors (off-white)
          vec3 color = vec3(0.98, 0.99, 1.0) * intensity;
          
          gl_FragColor = vec4(color, intensity * 0.15);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.lightSweep = new THREE.Mesh(geometry, material);
    this.lightSweep.position.z = -2;
    this.scene.add(this.lightSweep);
  }

  // Soft spotlight glow behind remotes (right side)
  createSpotlightGlow() {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          
          // Radial gradient from center-right
          vec2 center = vec2(0.7, 0.5);
          float dist = distance(uv, center);
          
          // Soft radial falloff
          float intensity = 1.0 - smoothstep(0.0, 0.6, dist);
          
          // Very subtle pulse - t4h style minimal
          float pulse = sin(time * 0.15) * 0.05 + 0.95;
          
          // Extremely subtle neutral light
          vec3 color = vec3(0.98, 0.99, 1.0) * intensity * pulse * 0.06;
          
          gl_FragColor = vec4(color, intensity * 0.12);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.spotlight = new THREE.Mesh(geometry, material);
    this.spotlight.position.set(3, 0, -1);
    this.scene.add(this.spotlight);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Time progression for wave animation
    this.time += 0.01;

    // Update uniforms
    if (this.lightSweep) {
      this.lightSweep.material.uniforms.time.value = this.time;
    }
    if (this.spotlight) {
      this.spotlight.material.uniforms.time.value = this.time;
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (this.lightSweep) {
      this.lightSweep.material.uniforms.resolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
      const canvas = this.renderer.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
    if (this.lightSweep) {
      this.lightSweep.geometry.dispose();
      this.lightSweep.material.dispose();
    }
    if (this.spotlight) {
      this.spotlight.geometry.dispose();
      this.spotlight.material.dispose();
    }
  }
}

// Initialize when DOM is ready and Three.js is loaded
function initHeroBackground() {
  if (typeof THREE === 'undefined') {
    setTimeout(initHeroBackground, 100);
    return;
  }

  const container = document.getElementById('hero-background-container');
  if (container && !window.heroBackground) {
    try {
      window.heroBackground = new HeroBackground('hero-background-container');
    } catch (error) {
      console.warn('Three.js background initialization failed:', error);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroBackground);
} else {
  initHeroBackground();
}

setTimeout(initHeroBackground, 500);
