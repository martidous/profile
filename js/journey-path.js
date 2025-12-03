// ===================================
// JOURNEY PATH SKETCH (Vertical connecting line)
// ===================================

let journeySketch = function(p) {
    let pathHeight = 0;
    let targetHeight = 0;
    let nodePositions = [];
    let pathWidth = 4;
    
    // Color variables
    let currentColor;
    let previousColor;
    let colorTransition = 0;
    
    p.setup = function() {
        let canvas = p.createCanvas(pathWidth, 100); // Height will be updated
        canvas.parent('journey-path-canvas');
        
        // Initialize colors
        currentColor = p.color(0, 168, 255); // Blue
        previousColor = p.color(0, 168, 255);
    };
    
    p.draw = function() {
        p.clear();
        
        // Smooth path height transition
        pathHeight = p.lerp(pathHeight, targetHeight, 0.1);
        
        // Smooth color transition
        if (colorTransition < 1) {
            colorTransition += 0.02;
        }
        let displayColor = p.lerpColor(previousColor, currentColor, colorTransition);
        
        // Draw the vertical path
        if (pathHeight > 0) {
            p.noFill();
            p.stroke(displayColor);
            p.strokeWeight(pathWidth);
            p.line(pathWidth / 2, 0, pathWidth / 2, pathHeight);
            
            // Add subtle glow
            p.stroke(displayColor.levels[0], displayColor.levels[1], displayColor.levels[2], 50);
            p.strokeWeight(pathWidth + 4);
            p.line(pathWidth / 2, 0, pathWidth / 2, pathHeight);
        }
    };
    
    p.windowResized = function() {
        updateCanvasSize();
    };
    
    // Public function to update path based on scroll
    p.updatePath = function(scrollProgress, containerHeight) {
        p.resizeCanvas(pathWidth, containerHeight);
        targetHeight = scrollProgress * containerHeight;
    };
    
    // Public function to set color based on active node
    p.setNodeColor = function(nodeIndex) {
        previousColor = currentColor;
        colorTransition = 0;
        
        switch(nodeIndex) {
            case 0:
                currentColor = p.color(0, 168, 255); // Blue - Structure
                break;
            case 1:
                currentColor = p.color(255, 107, 53); // Orange - Friction
                break;
            case 2:
                currentColor = p.color(0, 255, 200); // Cyan - Flow
                break;
            case 3:
                currentColor = p.color(0, 168, 255); // Blue - Synthesis
                break;
            default:
                currentColor = p.color(160, 160, 160); // Gray
        }
    };
};

// Create the journey path instance
let journeyPathInstance = new p5(journeySketch);

// Update canvas size based on journey container
function updateCanvasSize() {
    const container = document.querySelector('.journey-container');
    if (container && journeyPathInstance) {
        const height = container.offsetHeight;
        journeyPathInstance.resizeCanvas(4, height);
    }
}

// Initialize canvas size
setTimeout(updateCanvasSize, 100);
window.addEventListener('resize', updateCanvasSize);
