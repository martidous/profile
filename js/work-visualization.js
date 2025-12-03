// ===================================
// WORK SECTION - SIMPLE OVAL NODES
// ===================================

let workSketch = function(p) {
    let projects = [];
    let pathPoints = [];

    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, 800);
        canvas.parent('work-path-canvas');

        // Initialize project nodes in a simple flowing path
        initializeProjects();
        generatePathPoints();
    };

    function initializeProjects() {
        // Simple vertical-ish flowing path
        const projectPositions = [
            { x: 0.15, y: 0.15 },  // 1
            { x: 0.35, y: 0.25 },  // 2
            { x: 0.55, y: 0.18 },  // 3
            { x: 0.20, y: 0.50 },  // 4
            { x: 0.45, y: 0.60 },  // 5
            { x: 0.70, y: 0.55 }   // 6
        ];

        projectsData.forEach((project, index) => {
            const pos = projectPositions[index];
            projects.push({
                id: project.id,
                title: project.title,
                hasEmbed: project.hasEmbed,
                index: index,
                x: p.width * pos.x,
                y: p.height * pos.y,
                baseX: pos.x,
                baseY: pos.y,
                hovered: false
            });
        });
    }

    function generatePathPoints() {
        // Generate smooth curve through project points
        pathPoints = [];
        for (let i = 0; i < projects.length - 1; i++) {
            let start = projects[i];
            let end = projects[i + 1];

            // Add points along bezier curve between nodes
            for (let t = 0; t <= 1; t += 0.02) {
                let x = p.lerp(start.x, end.x, t);
                let y = p.lerp(start.y, end.y, t);
                pathPoints.push({ x, y });
            }
        }
    }

    p.draw = function() {
        p.clear();

        // Draw connecting path
        drawPath();

        // Draw project oval nodes
        drawProjects();
    };

    function drawPath() {
        if (pathPoints.length === 0) return;

        // Subtle connecting line
        p.noFill();
        p.stroke(255, 255, 255, 30);
        p.strokeWeight(2);

        p.beginShape();
        for (let point of pathPoints) {
            p.vertex(point.x, point.y);
        }
        p.endShape();
    }

    function drawProjects() {
        projects.forEach((project, index) => {
            let isHovered = checkHover(project);
            project.hovered = isHovered;

            // Simple oval shape
            let ovalWidth = 60;
            let ovalHeight = 40;

            if (isHovered) {
                ovalWidth += 8;
                ovalHeight += 6;
            }

            // Glow for active projects
            if (project.hasEmbed) {
                p.noStroke();
                p.fill(0, 255, 200, isHovered ? 30 : 15);
                p.ellipse(project.x, project.y, ovalWidth + 20, ovalHeight + 15);
            }

            // Main oval
            if (project.hasEmbed) {
                p.fill(10, 10, 15);
                p.stroke(0, 255, 200);
            } else {
                p.fill(10, 10, 15);
                p.stroke(255, 255, 255, 100);
            }
            p.strokeWeight(2);
            p.ellipse(project.x, project.y, ovalWidth, ovalHeight);

            // Number inside
            p.noStroke();
            if (project.hasEmbed) {
                p.fill(0, 255, 200);
            } else {
                p.fill(255, 255, 255, 150);
            }
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(18);
            p.textFont('JetBrains Mono');
            let displayNum = (index + 1).toString().padStart(2, '0');
            p.text(displayNum, project.x, project.y);
        });
    }

    function checkHover(project) {
        let d = p.dist(p.mouseX, p.mouseY, project.x, project.y);
        return d < 40;
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, 800);
        // Recalculate positions
        projects.forEach(project => {
            project.x = p.width * project.baseX;
            project.y = p.height * project.baseY;
        });
        generatePathPoints();
    };

    // Export function to get project at mouse position
    p.getHoveredProject = function() {
        for (let project of projects) {
            if (project.hovered) {
                return project;
            }
        }
        return null;
    };
};

// Initialize the sketch
let workVisualization = new p5(workSketch);
