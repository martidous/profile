// p5 overlay to test a 3D-styled hero title without touching existing markup/styles
let heroTitle3D = new p5(p => {
    let parentEl;
    let titleText = 'Martuza Ferdous';
    let titleSize = 72;

    p.setup = function() {
        parentEl = document.getElementById('hero-title-3d');
        if (!parentEl) return;

        const h1 = parentEl.parentElement?.querySelector('.hero-title');
        if (h1) {
            titleText = h1.textContent.trim() || titleText;
            const computed = window.getComputedStyle(h1);
            titleSize = parseFloat(computed.fontSize) || titleSize;
        }

        const { width, height } = getParentSize();
        const c = p.createCanvas(width, height, p.WEBGL);
        c.parent(parentEl);
        p.textFont('Inter');
        p.textSize(titleSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.noStroke();
    };

    p.windowResized = function() {
        if (!parentEl) return;
        const { width, height } = getParentSize();
        p.resizeCanvas(width, height);
    };

    p.draw = function() {
        if (!parentEl) return;
        p.clear();

        // Slight wobble to show depth
        const tilt = Math.sin(p.frameCount * 0.01) * 6;
        p.push();
        p.rotateY(p.radians(-14));
        p.rotateX(p.radians(tilt));

        const shadow = p.color(0, 168, 255, 90); // matches accent structure hue
        const face = p.color(255, 255, 255);

        // Draw stacked shadow layers for depth
        for (let z = -24; z < 0; z += 2) {
            p.push();
            p.translate(0, 0, z);
            p.fill(shadow);
            p.text(titleText, 0, 0);
            p.pop();
        }

        // Front face
        p.fill(face);
        p.text(titleText, 0, 0);

        p.pop();
    };

    function getParentSize() {
        const rect = parentEl?.getBoundingClientRect();
        const width = rect?.width || 600;
        // Give a bit of breathing room vertically
        const height = Math.max(titleSize * 2, 180);
        return { width, height };
    }
});
