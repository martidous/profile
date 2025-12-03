# Portfolio Website

A scroll-based narrative portfolio with generative p5.js visuals that evolve as you navigate through the story.

## Quick Start

Open `index.html` in a browser. No build process required.

## Structure

- `index.html` - Main content and structure
- `css/` - Styling and responsive design
- `js/` - Interactive components and p5.js animations
- `assets/` - Images and media files

## Key Features

### Generative Background

The p5.js path animation transforms through four states:
1. **Structure** - Grid-aligned lines (technical foundation)
2. **Friction** - Curved waves with noise (tension and questions)
3. **Flow** - Organic curves with particles (creative transformation)
4. **Synthesis** - Smooth balanced waves (integrated identity)

### Color System

Colors evolve with scroll position:
- Structure: Electric Blue (#00A8FF)
- Friction: Warm Orange (#FF6B35)
- Flow: Cyan (#00FFC8) and Magenta (#FF0080)
- Synthesis: Blended gradient

### Projects

Project data is managed in `js/project-data.js`. Each project includes:
- Title and description
- Tags for categorization
- Embed URL for interactive demos
- Modal display system

## Customization

### Content
Edit `index.html` to update:
- Personal information
- Story sections
- Contact details

### Projects
Modify `js/project-data.js` to add or edit projects.

### Styling
Color variables and spacing are defined in `css/main.css`.

### Animation
Path behavior can be adjusted in `js/path-sketch.js`.


Upload all files maintaining the folder structure.

## Browser Support

Modern browsers with ES6 and canvas support required.
