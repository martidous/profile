// ===================================
// SCROLL CONTROLLER
// ===================================

let scrollTimeout;

// Track scroll position and update p5.js sketch
function handleScroll() {
    // Calculate scroll progress (0 to 1)
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progress = scrollPosition / scrollHeight;
    
    // Update main p5.js sketch
    if (typeof updateScrollProgress === 'function') {
        updateScrollProgress(progress);
    }
    
    // Update journey path and nodes
    updateJourneyProgress();
    
    // Update active navigation dot
    updateActiveNavDot();
    
    // Update accent color for nav dots based on section
    updateNavDotColors(progress);
    
    // Clear existing timeout
    clearTimeout(scrollTimeout);
    
    // Additional scroll-based effects
    scrollTimeout = setTimeout(() => {
        // Additional scroll-based effects can go here
    }, 100);
}

// Update journey path based on scroll through the story section
function updateJourneyProgress() {
    const storySection = document.getElementById('story');
    const journeyNodes = document.querySelectorAll('.journey-node');
    const journeyContainer = document.querySelector('.journey-container');
    
    if (!storySection || journeyNodes.length === 0) return;
    
    // Get section bounds
    const sectionTop = storySection.offsetTop;
    const sectionBottom = sectionTop + storySection.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    // Calculate progress through the story section
    let sectionProgress = 0;
    if (scrollPosition > sectionTop) {
        sectionProgress = Math.min(1, (scrollPosition - sectionTop) / storySection.offsetHeight);
    }
    
    // Update journey path
    if (journeyPathInstance && journeyContainer) {
        const containerHeight = journeyContainer.offsetHeight;
        journeyPathInstance.updatePath(sectionProgress, containerHeight);
    }
    
    // Activate nodes as we scroll past them
    let activeNodeIndex = -1;
    journeyNodes.forEach((node, index) => {
        const nodeTop = node.offsetTop + sectionTop;
        const nodeCenter = nodeTop + node.offsetHeight / 2;
        
        if (scrollPosition >= nodeCenter) {
            node.classList.add('active');
            activeNodeIndex = index;
        } else {
            node.classList.remove('active');
        }
    });
    
    // Update path color based on active node
    if (activeNodeIndex >= 0 && journeyPathInstance) {
        journeyPathInstance.setNodeColor(activeNodeIndex);
    }
}

// Update which navigation dot is active
function updateActiveNavDot() {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    let currentSection = 0;
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = index;
        }
    });
    
    navDots.forEach((dot, index) => {
        if (index === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Update navigation dot colors based on scroll progress
function updateNavDotColors(progress) {
    const navDots = document.querySelectorAll('.nav-dot');
    let color;
    
    if (progress < 0.25) {
        color = '#00A8FF'; // Blue
    } else if (progress < 0.5) {
        color = '#FF6B35'; // Orange
    } else if (progress < 0.75) {
        color = '#00FFC8'; // Cyan
    } else {
        color = '#00A8FF'; // Back to blue (synthesis)
    }
    
    navDots.forEach(dot => {
        if (dot.classList.contains('active')) {
            dot.style.backgroundColor = color;
            dot.style.boxShadow = `0 0 20px ${color}`;
        }
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize scroll tracking
function initScrollController() {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call to set correct state
    handleScroll();
    
    // Update on resize
    window.addEventListener('resize', () => {
        setTimeout(handleScroll, 100);
    });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollController);
} else {
    initScrollController();
}
