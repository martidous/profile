// ===================================
// HERO SHAPE SKETCH - CONNECTION NETWORK
// Visual metaphor for technology meeting creativity
// ===================================

let heroShapeSketch = function(p) {
    let nodes = [];
    let connections = [];
    let time = 0;
    let numNodes = 8;

    class Node {
        constructor(index) {
            let angle = (p.TWO_PI / numNodes) * index;
            this.angle = angle;
            this.targetRadius = 70;
            this.currentRadius = 70;
            this.size = 6;
            this.id = index;

            // Rainbow distribution - each node gets a different hue
            this.hue = (360 / numNodes) * index;

            this.pulseOffset = p.random(p.TWO_PI);
            this.orbitSpeed = 0.3;
        }

        update(t) {
            // Slow rotation
            this.angle += 0.005;

            // Subtle breathing motion
            let breathe = p.sin(t * 2 + this.pulseOffset) * 3;
            this.currentRadius = this.targetRadius + breathe;
        }

        show(t) {
            let x = p.cos(this.angle) * this.currentRadius;
            let y = p.sin(this.angle) * this.currentRadius;

            p.push();
            p.translate(x, y);

            p.colorMode(p.HSB, 360, 100, 100, 255);

            // Outer glow ring - pulsing
            let pulseSize = this.size + 2 + p.sin(t * 3 + this.pulseOffset) * 1.5;
            p.noFill();
            p.strokeWeight(2);
            p.stroke(this.hue, 80, 100, 150);
            p.circle(0, 0, pulseSize * 3);

            // Glow
            p.noStroke();
            p.fill(this.hue, 70, 100, 80);
            p.circle(0, 0, this.size * 2.5);

            // Core
            p.fill(this.hue, 90, 100, 255);
            p.circle(0, 0, this.size);

            // Highlight
            p.fill(0, 0, 100, 200);
            p.circle(1, -1, this.size * 0.4);

            p.colorMode(p.RGB, 255);
            p.pop();

            return { x: x, y: y };
        }
    }

    class Connection {
        constructor(node1, node2) {
            this.node1 = node1;
            this.node2 = node2;
            this.strength = 0;
            this.targetStrength = 0;
            this.active = false;
        }

        update() {
            // Smooth interpolation
            this.strength = p.lerp(this.strength, this.targetStrength, 0.1);
        }

        show(pos1, pos2, t) {
            if (this.strength > 0.01) {
                p.colorMode(p.HSB, 360, 100, 100, 255);

                // Flowing gradient between node colors
                let flowOffset = t * 2;
                let segments = 10;

                for (let i = 0; i < segments; i++) {
                    let t1 = i / segments;
                    let t2 = (i + 1) / segments;

                    let x1 = p.lerp(pos1.x, pos2.x, t1);
                    let y1 = p.lerp(pos1.y, pos2.y, t1);
                    let x2 = p.lerp(pos1.x, pos2.x, t2);
                    let y2 = p.lerp(pos1.y, pos2.y, t2);

                    // Color gradient between the two node colors
                    let hue = p.lerp(this.node1.hue, this.node2.hue, t1);

                    // Flowing alpha
                    let alpha = p.map(p.sin(t1 * p.TWO_PI * 2 + flowOffset), -1, 1, 80, 180);
                    alpha *= this.strength;

                    p.strokeWeight(2.5 * this.strength);
                    p.stroke(hue, 85, 100, alpha);
                    p.line(x1, y1, x2, y2);
                }

                p.colorMode(p.RGB, 255);
            }
        }
    }

    p.setup = function() {
        let canvas = p.createCanvas(200, 200);
        canvas.parent('hero-shape-canvas');

        // Create nodes
        for (let i = 0; i < numNodes; i++) {
            nodes.push(new Node(i));
        }

        // Create potential connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                // Connect adjacent nodes and cross-connections
                let distance = Math.abs(i - j);
                if (distance <= 2 || distance >= nodes.length - 2) {
                    connections.push(new Connection(nodes[i], nodes[j]));
                }
            }
        }
    };

    p.draw = function() {
        p.clear();

        p.push();
        p.translate(p.width / 2, p.height / 2);

        // Dynamic connection activation pattern
        connections.forEach((conn, index) => {
            // Wave pattern of activation
            let activationWave = p.sin(time * 1.5 + index * 0.5);
            conn.targetStrength = p.map(activationWave, -1, 1, 0.2, 1);
            conn.update();
        });

        // Update nodes
        nodes.forEach(node => {
            node.update(time);
        });

        // Draw connections
        connections.forEach(conn => {
            let pos1 = {
                x: p.cos(conn.node1.angle) * conn.node1.currentRadius,
                y: p.sin(conn.node1.angle) * conn.node1.currentRadius
            };
            let pos2 = {
                x: p.cos(conn.node2.angle) * conn.node2.currentRadius,
                y: p.sin(conn.node2.angle) * conn.node2.currentRadius
            };
            conn.show(pos1, pos2, time);
        });

        // Draw nodes on top
        nodes.forEach(node => {
            node.show(time);
        });

        // Center convergence point - rotating rainbow
        p.colorMode(p.HSB, 360, 100, 100, 255);
        let coreSize = 12 + 4 * p.sin(time * 3);
        let coreHue = (time * 30) % 360; // Rotating through rainbow

        // Pulsing glow
        for (let i = 3; i > 0; i--) {
            p.noStroke();
            p.fill(coreHue, 85, 100, 70 / i);
            p.circle(0, 0, coreSize * i * 1.5);
        }

        // Core
        p.fill(coreHue, 90, 100, 255);
        p.circle(0, 0, coreSize);

        // Bright center
        p.fill(0, 0, 100, 240);
        p.circle(0, 0, coreSize * 0.5);

        p.colorMode(p.RGB, 255);
        p.pop();

        time += 0.02;
    };
};

// Create the hero shape instance
let heroShapeInstance = new p5(heroShapeSketch);
