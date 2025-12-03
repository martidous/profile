const { Engine, World, Bodies, Runner } = Matter;

function setupNameParticles() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Split text into individual letter spans, preserving styles
    const text = heroTitle.textContent;
    heroTitle.innerHTML = text.split('').map(letter => 
        `<span style="display: inline-block; position: relative; color: inherit; font-size: inherit; font-weight: inherit;">${letter === ' ' ? '&nbsp;' : letter}</span>`
    ).join('');

    const container = heroTitle.parentElement;
    
    // Create canvas overlay
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '5';
    container.style.position = 'relative';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create physics engine
    const engine = Engine.create();
    engine.gravity.y = 0.8;
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Wait a bit for layout to settle
    setTimeout(() => {
        // Create invisible boundaries around each letter
        const letterBodies = [];
        const letters = heroTitle.querySelectorAll('span');
        
        console.log('Found letters:', letters.length);
        
        letters.forEach((letter, i) => {
            const rect = letter.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;
            
            console.log(`Letter ${i}: x=${x}, y=${y}, w=${rect.width}, h=${rect.height}`);
            
            const letterBody = Bodies.rectangle(x, y, rect.width, rect.height, {
                isStatic: true,
                restitution: 0.9
            });
            
            World.add(engine.world, letterBody);
            letterBodies.push(letterBody);
        });
    }, 100);

    // Add floor so particles don't fall forever
    const floor = Bodies.rectangle(
        canvas.width / 2, 
        canvas.height + 25, 
        canvas.width, 
        50, 
        { isStatic: true }
    );
    World.add(engine.world, floor);

    // Create particles
    const particles = [];
    const maxParticles = 40;

    function createParticle() {
        if (particles.length >= maxParticles) return;
        
        const x = Math.random() * canvas.width;
        const y = -10;
        const radius = Math.random() * 2 + 1.5;
        
        const particle = Bodies.circle(x, y, radius, {
            restitution: 0.8,
            friction: 0.001,
            density: 0.001
        });
        
        World.add(engine.world, particle);
        particles.push(particle);
    }

    // Spawn particles periodically
    setInterval(createParticle, 150);

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Remove particles that are resting on floor
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].position.y > canvas.height) {
                World.remove(engine.world, particles[i]);
                particles.splice(i, 1);
            }
        }
        
        // Draw particles
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(
                particle.position.x,
                particle.position.y,
                particle.circleRadius,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = 'rgba(0, 217, 255, 0.8)';
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

document.addEventListener('DOMContentLoaded', setupNameParticles);