// ===================================
// HERO SHAPE SKETCH 
// ===================================

let heroShapeSketch = function(p) {
    let angle = 0;
    let shapes = [];
    let numShapes = 3;
    
    p.setup = function() {
        let canvas = p.createCanvas(200, 200);
        canvas.parent('hero-shape-canvas');
        
        // Create morphing shapes
        for (let i = 0; i < numShapes; i++) {
            shapes.push({
                rotation: i * (p.TWO_PI / numShapes),
                size: 60 + i * 20,
                speed: 0.01 + i * 0.005,
                color: i
            });
        }
    };
    
    p.draw = function() {
        p.clear();
        
        p.push();
        p.translate(p.width / 2, p.height / 2);
        
        // Draw multiple rotating shapes
        shapes.forEach((shape, index) => {
            p.push();
            p.rotate(angle * shape.speed + shape.rotation);
            
            // Set vibrant colors
            p.noFill();
            p.strokeWeight(3);
            
            if (shape.color === 0) {
                p.stroke(0, 255, 200, 200); // Cyan
            } else if (shape.color === 1) {
                p.stroke(255, 0, 128, 200); // Magenta
            } else {
                p.stroke(0, 168, 255, 200); // Blue
            }
            
            // Draw morphing polygon
            p.beginShape();
            for (let i = 0; i < 6; i++) {
                let angleStep = p.TWO_PI / 6;
                let r = shape.size + p.sin(angle * 2 + i) * 15;
                let x = p.cos(angleStep * i) * r;
                let y = p.sin(angleStep * i) * r;
                p.vertex(x, y);
            }
            p.endShape(p.CLOSE);
            
            p.pop();
        });
        
        p.pop();
        
        angle += 0.01;
    };
};

// Create the hero shape instance
let heroShapeInstance = new p5(heroShapeSketch);