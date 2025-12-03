// ===================================
// COLOR TRANSITIONS - Subtle background shifts
// ===================================

function initColorTransitions() {
    const body = document.body;

    // Subtle background color variations for each section
    const sectionColors = {
        hero: '#000000',           // Pure black
        story: '#020308',          // Very subtle blue tint
        work: '#040206',           // Very subtle purple tint
        contact: '#030405'         // Very subtle cyan tint
    };

    function updateBackgroundColor() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        let activeSection = 'hero';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.id;
                if (sectionColors[sectionId]) {
                    activeSection = sectionId;
                }
            }
        });

        // Apply subtle color transition
        body.style.backgroundColor = sectionColors[activeSection];
    }

    // Update on scroll with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateBackgroundColor();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial update
    updateBackgroundColor();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initColorTransitions);
} else {
    initColorTransitions();
}
