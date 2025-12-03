// ===================================
// FOOTER ANIMATION - Subtle Scanning Ray
// Minimal horizontal beam passing across
// ===================================

let footerSketch = function(p) {
    let rayX = 0;
    let rayWidth = 150;
    let raySpeed = 2;

    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, 60);
        canvas.parent('footer-canvas');
        rayX = -rayWidth;
    };

    p.draw = function() {
        p.clear();

        // Draw thin horizontal line across footer
        p.stroke(255, 255, 255, 15);
        p.strokeWeight(1);
        p.line(0, p.height / 2, p.width, p.height / 2);

        // Draw moving ray
        p.noStroke();

        // Create gradient effect for the ray
        for (let i = 0; i < rayWidth; i++) {
            let x = rayX + i;

            if (x >= 0 && x <= p.width) {
                // Gradient from edges to center of ray
                let distFromCenter = Math.abs(i - rayWidth / 2);
                let opacity = p.map(distFromCenter, 0, rayWidth / 2, 50, 0);

                p.fill(255, 255, 255, opacity);
                p.rect(x, p.height / 2 - 2, 1, 4);
            }
        }

        // Move ray
        rayX += raySpeed;

        // Reset when ray passes screen
        if (rayX > p.width + rayWidth) {
            rayX = -rayWidth;
        }
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, 60);
    };
};

// Create the footer animation instance
let footerInstance = new p5(footerSketch);
