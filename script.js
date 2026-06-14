const yearElement = document.getElementById("year");
const particleCanvas = document.getElementById("hero-particles-canvas");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (particleCanvas && !reduceMotionQuery.matches) {
  const context = particleCanvas.getContext("2d", { alpha: true });

  if (context) {
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrame = 0;

    const particles = [];
    const particleCount = 36;

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.5,
      speedX: (Math.random() - 0.5) * 0.13,
      speedY: (Math.random() - 0.5) * 0.13,
      drift: Math.random() * Math.PI * 2,
    });

    const resizeCanvas = () => {
      const rect = particleCanvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      particleCanvas.width = Math.round(width * dpr);
      particleCanvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    for (let i = 0; i < particleCount; i += 1) {
      particles.push(createParticle());
    }

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.drift += 0.01;
        particle.x += particle.speedX + Math.cos(particle.drift) * 0.06;
        particle.y += particle.speedY + Math.sin(particle.drift) * 0.05;

        if (particle.x < -12) particle.x = width + 12;
        if (particle.x > width + 12) particle.x = -12;
        if (particle.y < -12) particle.y = height + 12;
        if (particle.y > height + 12) particle.y = -12;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(17, 17, 19, 0.14)";
        context.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const particleA = particles[i];
          const particleB = particles[j];
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 110) {
            const alpha = (1 - distance / 110) * 0.1;
            context.beginPath();
            context.moveTo(particleA.x, particleA.y);
            context.lineTo(particleB.x, particleB.y);
            context.strokeStyle = `rgba(17, 17, 19, ${alpha.toFixed(3)})`;
            context.lineWidth = 0.8;
            context.stroke();
          }
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resizeCanvas();
      for (const particle of particles) {
        if (particle.x > width) particle.x = Math.random() * width;
        if (particle.y > height) particle.y = Math.random() * height;
      }
    };

    window.addEventListener("resize", handleResize);

    reduceMotionQuery.addEventListener("change", (event) => {
      if (event.matches) {
        window.cancelAnimationFrame(animationFrame);
        context.clearRect(0, 0, width, height);
      }
    });
  }
}
