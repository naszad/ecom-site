import React, { useRef, useEffect } from 'react';

function NeonFireflies() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas to full screen
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Define cyberpunk colors
    const neonColors = [
      { r: 0, g: 255, b: 255 },    // Cyan
      { r: 255, g: 0, b: 255 },    // Magenta
      { r: 0, g: 255, b: 149 },    // Neon Green
    ];

    // -------------------------------
    // Particle class definition
    // -------------------------------
    class Particle {
      constructor() {
        this.initialize();
      }
      
      // Initialize or reinitialize the particle
      initialize() {
        // Start at a random horizontal position along the bottom (or slightly below)
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50 + 20;
        // Size between 1 and 3 pixels
        this.radius = Math.random() * 2;
        // Vertical speed: controls how fast it rises
        this.speed = Math.random() * 0.5 + 0.5;
        // Horizontal drift: small initial random value
        this.drift = Math.random() * 1 - 0.5;
        // Pick a random color from our palette
        this.color = neonColors[Math.floor(Math.random() * neonColors.length)];
        // Neon opacity for the glow effect
        this.alpha = Math.random() * 0.5 + 0.5;
        // Controls flickering: if true, the alpha decreases, otherwise increases
        this.fadingOut = Math.random() < 0.1;
        // Timer (in milliseconds) until we change horizontal drift direction
        this.driftChangeTimer = Math.floor(Math.random() * 1000) + 500; // 500ms to 1500ms
        // Record the last time we changed drift
        this.lastDriftChange = performance.now();
      }
      
      update(deltaTime, now) {
        // Occasionally change horizontal drift direction
        if (now - this.lastDriftChange > this.driftChangeTimer) {
          this.drift = Math.random() * 1 - 0.5;
          this.driftChangeTimer = Math.floor(Math.random() * 1000) + 500;
          this.lastDriftChange = now;
        }
        
        // Update position: drift horizontally and move upward
        this.x += this.drift;
        this.y -= this.speed;
        
        // Flicker effect: adjust the alpha slowly
        const flickerSpeed = 0.001 * deltaTime; // Adjust flicker speed based on delta time
        if (this.fadingOut) {
          this.alpha -= flickerSpeed;
          if (this.alpha < 0.3) {
            this.fadingOut = false;
          }
        } else {
          this.alpha += flickerSpeed;
          if (this.alpha > 1) {
            this.fadingOut = true;
          }
        }
      }
      
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // Use the particle's color with its current alpha
        const { r, g, b } = this.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
        // Add a glow effect using shadow properties with the same color
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
        ctx.fill();
      }
    }

    // -------------------------------
    // Animation variables and spawn logic
    // -------------------------------
    let particles = [];
    // Spawn a new particle every 100ms (i.e. 10 particles per second)
    const spawnInterval = 100;
    let spawnAccumulator = 0;
    let lastTimestamp = performance.now();

    // The main animation loop using requestAnimationFrame
    let animationFrameId;
    const animate = (timestamp) => {
      // Calculate the elapsed time (deltaTime) in milliseconds
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Clear the canvas for the next frame
      ctx.clearRect(0, 0, width, height);
      
      // Spawn new particles at a constant rate based on elapsed time
      spawnAccumulator += deltaTime;
      while (spawnAccumulator > spawnInterval) {
        particles.push(new Particle());
        spawnAccumulator -= spawnInterval;
      }
      
      // Update and draw each particle
      for (let particle of particles) {
        particle.update(deltaTime, timestamp);
        particle.draw(ctx);
      }
      
      // Remove particles that have floated off the top of the screen
      particles = particles.filter(particle => particle.y + particle.radius > 0);
      
      // Request the next frame
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    
    // Handle window resize to keep the canvas full-screen
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -10,         // Keep the canvas behind other content
        pointerEvents: 'none' // Allow clicks to pass through
      }}
    />
  );
}

export default NeonFireflies;
