// ===================================
// UI INTERACTIONS
// ===================================

// Navigation dot click handlers
function initNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionId = dot.getAttribute('data-section');
            scrollToSection(sectionId);
        });
    });
}

// Project card interactions
function initProjectCards() {
    // Initialize modal manager
    const modalManager = new ModalManager();
    const initialized = modalManager.init();

    if (!initialized) {
        console.warn('Modal manager failed to initialize');
        return;
    }

    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const hasEmbed = card.getAttribute('data-has-embed') === 'true';
        const projectId = card.getAttribute('data-project-id');

        if (hasEmbed && projectId) {
            card.addEventListener('click', () => {
                const projectData = projectsData.find(p => p.id === projectId);
                if (projectData && projectData.hasEmbed) {
                    modalManager.open(projectData, card);
                }
            });
        }
    });
}

// Smooth reveal animations for elements as they enter viewport
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Keyboard navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        const sections = ['hero', 'story', 'work', 'contact'];
        const currentSection = document.querySelector('.nav-dot.active')?.getAttribute('data-section');
        const currentIndex = sections.indexOf(currentSection);
        
        // Arrow down or Page Down
        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentIndex < sections.length - 1) {
            e.preventDefault();
            scrollToSection(sections[currentIndex + 1]);
        }
        
        // Arrow up or Page Up
        if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentIndex > 0) {
            e.preventDefault();
            scrollToSection(sections[currentIndex - 1]);
        }
        
        // Home key
        if (e.key === 'Home') {
            e.preventDefault();
            scrollToSection('hero');
        }
        
        // End key
        if (e.key === 'End') {
            e.preventDefault();
            scrollToSection('contact');
        }
    });
}

// Add mouse move tracking for enhanced interactivity
function initMouseTracking() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Pass mouse position to p5.js if needed
        // (p5.js already tracks this, but we can use it for other effects)
    });
}

// Initialize all UI interactions
function initUI() {
    initNavigation();
    initProjectCards();
    initScrollReveal();
    initKeyboardNav();
    initMouseTracking();
    
    // Add loading animation complete
    document.body.classList.add('loaded');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initUI, debounce };
}
