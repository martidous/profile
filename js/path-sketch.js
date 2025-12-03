// ===================================
// P5.JS GENERATIVE PATH SKETCH
// ===================================

let pathPoints = [];
let numPoints = 100;
let scrollProgress = 0; // 0 to 1
let currentState = 0; // 0-3 for four states
let parallaxOffset = 0; // For subtle parallax effect

// Color variables
let accentColor;
let secondaryColor;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");

  // Initialize path points
  for (let i = 0; i < numPoints; i++) {
    pathPoints.push({
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      noiseOffsetX: random(1000),
      noiseOffsetY: random(1000),
    });
  }
}

function draw() {
  clear();

  //Subtle parallax effect based on scroll
  parallaxOffset = scrollProgress * 50; // Subtle 50px movement

  // Update colors based on state
  updateColors();

  // Update path points based on scroll state
  updatePathPoints();

  // Draw the path with parallax
  push();
  translate(0, -parallaxOffset);
  drawPath();
  pop();

  // Optional: Draw particles in flow state
  if (currentState >= 2) {
    push();
    translate(0, -parallaxOffset * 0.5); // Particles move slower
    drawParticles();
    pop();
  }
}

function updateColors() {
  // Transition between color states based on scroll
  if (scrollProgress < 0.25) {
    // State 0: Structure - Blue
    accentColor = color(0, 168, 255);
    secondaryColor = color(0, 168, 255, 50);
  } else if (scrollProgress < 0.5) {
    // State 1: Friction - Blue to Orange
    let t = map(scrollProgress, 0.25, 0.5, 0, 1);
    accentColor = lerpColor(color(0, 168, 255), color(255, 107, 53), t);
    secondaryColor = lerpColor(
      color(0, 168, 255, 50),
      color(255, 107, 53, 50),
      t
    );
  } else if (scrollProgress < 0.75) {
    // State 2: Flow - Cyan and Magenta
    let t = map(scrollProgress, 0.5, 0.75, 0, 1);
    accentColor = lerpColor(color(255, 107, 53), color(0, 255, 200), t);
    secondaryColor = color(255, 0, 128, 100);
  } else {
    // State 3: Synthesis - Blended
    let t = map(scrollProgress, 0.75, 1, 0, 1);
    accentColor = lerpColor(color(0, 255, 200), color(0, 168, 255), t);
    secondaryColor = lerpColor(
      color(255, 0, 128, 100),
      color(0, 168, 255, 50),
      t
    );
  }
}

function updatePathPoints() {
  let centerY = height / 2;
  let amplitude = height * 0.2;
  let frequency = 0.002;

  for (let i = 0; i < numPoints; i++) {
    let progress = i / numPoints;
    let x = map(progress, 0, 1, 0, width);
    let y = centerY;

    // STATE 0: STRUCTURE (0-25% scroll)
    if (scrollProgress < 0.25) {
      // Straight line with minimal movement
      let breathe = sin(frameCount * 0.02 + i * 0.1) * 2;
      y = centerY + breathe;

      // Snap to grid
      x = floor(x / 20) * 20;
    }

    // STATE 1: FRICTION (25-50% scroll)
    else if (scrollProgress < 0.5) {
      let t = map(scrollProgress, 0.25, 0.5, 0, 1);

      // Introduce sine wave
      let sineWave = sin(x * frequency * 2) * amplitude * 0.3 * t;

      // Add mild Perlin noise
      let noiseAmount = noise(
        pathPoints[i].noiseOffsetX + frameCount * 0.005,
        pathPoints[i].noiseOffsetY
      );
      let noiseDisplacement = map(noiseAmount, 0, 1, -20, 20) * t;

      y = centerY + sineWave + noiseDisplacement;

      // Occasional breaks (gaps)
      if (random(1) < 0.01 * t) {
        pathPoints[i].broken = true;
        setTimeout(() => (pathPoints[i].broken = false), 500);
      }
    }

    // STATE 2: FLOW (50-75% scroll)
    else if (scrollProgress < 0.75) {
      // Full organic curves with high Perlin noise
      let noiseAmount = noise(
        pathPoints[i].noiseOffsetX + frameCount * 0.01,
        pathPoints[i].noiseOffsetY + frameCount * 0.01
      );
      let noiseDisplacement = map(noiseAmount, 0, 1, -amplitude, amplitude);

      // Mouse influence
      let mouseInfluence = 0;
      if (mouseX > 0 && mouseY > 0) {
        let distance = dist(x, centerY, mouseX, mouseY);
        if (distance < 200) {
          mouseInfluence = map(distance, 0, 200, 50, 0);
          let angle = atan2(mouseY - centerY, mouseX - x);
          noiseDisplacement += sin(angle) * mouseInfluence;
        }
      }

      y = centerY + noiseDisplacement;
    }

    // STATE 3: SYNTHESIS (75-100% scroll)
    else {
      let t = map(scrollProgress, 0.75, 1, 0, 1);

      // Smooth flowing wave
      let wave = sin(x * frequency + frameCount * 0.02) * amplitude * 0.5;

      // Subtle noise
      let noiseAmount = noise(
        pathPoints[i].noiseOffsetX + frameCount * 0.008,
        pathPoints[i].noiseOffsetY
      );
      let noiseDisplacement = map(noiseAmount, 0, 1, -30, 30);

      // Blend wave and noise
      y = centerY + lerp(wave, noiseDisplacement, 0.5);

      // Slight return to structure
      let gridSnap = floor(y / 10) * 10;
      y = lerp(y, gridSnap, t * 0.2);
    }

    // Smooth movement
    pathPoints[i].targetX = x;
    pathPoints[i].targetY = y;
    pathPoints[i].x = lerp(pathPoints[i].x, pathPoints[i].targetX, 0.1);
    pathPoints[i].y = lerp(pathPoints[i].y, pathPoints[i].targetY, 0.1);
  }
}

function drawPath() {
  noFill();
  strokeWeight(3);

  // Draw glow effect for flow states
  if (scrollProgress > 0.5) {
    stroke(secondaryColor);
    strokeWeight(8);
    beginShape();
    for (let point of pathPoints) {
      if (!point.broken) {
        vertex(point.x, point.y);
      }
    }
    endShape();
  }

  // Draw main path
  stroke(accentColor);
  strokeWeight(3);
  beginShape();
  for (let point of pathPoints) {
    if (!point.broken) {
      vertex(point.x, point.y);
    } else {
      endShape();
      beginShape();
    }
  }
  endShape();

  // Draw nodes in structure state
  if (scrollProgress < 0.25) {
    fill(accentColor);
    noStroke();
    for (let i = 0; i < pathPoints.length; i += 20) {
      let point = pathPoints[i];
      circle(point.x, point.y, 8);
    }
  }
}

function drawParticles() {
  // Simple particle trails in flow state
  if (frameCount % 5 === 0) {
    let randomPoint = random(pathPoints);
    fill(accentColor);
    noStroke();
    circle(
      randomPoint.x + random(-10, 10),
      randomPoint.y + random(-10, 10),
      random(2, 6)
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Update scroll progress from external script
function updateScrollProgress(progress) {
  if (typeof constrain === "function") {
    scrollProgress = constrain(progress, 0, 1);
  } else {
    scrollProgress = Math.max(0, Math.min(1, progress));
  }
  currentState = Math.floor(scrollProgress * 4);
}
