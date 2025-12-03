// ===================================
// MODAL MANAGER - Handles project sketch embeds
// ===================================

class ModalManager {
    constructor() {
        this.modal = null;
        this.modalBackdrop = null;
        this.modalContent = null;
        this.modalClose = null;
        this.modalTitle = null;
        this.modalLoading = null;
        this.modalEmbed = null;
        this.currentProjectId = null;
        this.iframe = null;
        this.triggerElement = null;
        this.loadTimeout = null;
    }

    /**
     * Initialize modal manager - cache DOM elements and setup event listeners
     */
    init() {
        // Cache modal elements
        this.modal = document.getElementById('project-modal');

        if (!this.modal) {
            console.error('Modal element not found. Make sure #project-modal exists in HTML.');
            return false;
        }

        this.modalBackdrop = this.modal.querySelector('.modal-backdrop');
        this.modalContent = this.modal.querySelector('.modal-content');
        this.modalClose = this.modal.querySelector('.modal-close');
        this.modalTitle = this.modal.querySelector('.modal-title');
        this.modalLoading = this.modal.querySelector('.modal-loading');
        this.modalEmbed = this.modal.querySelector('.modal-embed');

        // Setup event listeners
        this.setupEventListeners();

        return true;
    }

    /**
     * Setup all event listeners for modal interactions
     */
    setupEventListeners() {
        // Close button click
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.close());
        }

        // Backdrop click
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', () => this.close());
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.getAttribute('data-state') === 'open') {
                this.close();
            }
        });

        // Prevent clicks inside modal content from closing modal
        if (this.modalContent) {
            this.modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    /**
     * Open modal with project sketch
     */
    open(projectData, triggerElement = null) {
        if (!projectData || !projectData.hasEmbed || !projectData.embedUrl) {
            console.warn('Invalid project data or no embed URL', projectData);
            return;
        }

        // Store trigger element for focus return
        this.triggerElement = triggerElement;
        this.currentProjectId = projectData.id;

        // Set modal title
        if (this.modalTitle) {
            this.modalTitle.textContent = projectData.title;
        }

        // Show modal with loading state
        this.modal.setAttribute('data-state', 'open');
        this.modal.setAttribute('aria-hidden', 'false');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Show loading, hide embed
        if (this.modalLoading) {
            this.modalLoading.style.display = 'flex';
        }
        if (this.modalEmbed) {
            this.modalEmbed.style.display = 'none';
        }

        // Create and load iframe
        this.createIframe(projectData);

        // Focus close button for accessibility
        setTimeout(() => {
            if (this.modalClose) {
                this.modalClose.focus();
            }
        }, 100);
    }

    /**
     * Create iframe element and handle loading
     */
    createIframe(projectData) {
        // Clear any existing iframe
        if (this.iframe) {
            this.iframe.remove();
            this.iframe = null;
        }

        // Clear any existing timeout
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }

        // Create new iframe
        this.iframe = document.createElement('iframe');
        this.iframe.src = projectData.embedUrl;
        this.iframe.setAttribute('frameborder', '0');
        this.iframe.setAttribute('loading', 'eager');
        this.iframe.setAttribute('allow', 'fullscreen; accelerometer; gyroscope');
        this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
        this.iframe.setAttribute('title', `${projectData.title} - Interactive Sketch`);
        this.iframe.setAttribute('aria-label', projectData.description);

        // Add class for styling
        this.iframe.className = 'modal-iframe';

        // Set timeout for loading (15 seconds)
        this.loadTimeout = setTimeout(() => {
            this.handleLoadTimeout(projectData);
        }, 15000);

        // Handle iframe load
        this.iframe.addEventListener('load', () => {
            this.handleIframeLoad();
        });

        // Handle iframe error
        this.iframe.addEventListener('error', () => {
            this.handleIframeError(projectData);
        });

        // Append iframe to embed container
        if (this.modalEmbed) {
            this.modalEmbed.appendChild(this.iframe);
        }
    }

    /**
     * Handle successful iframe load
     */
    handleIframeLoad() {
        // Clear timeout
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }

        // Hide loading, show embed
        if (this.modalLoading) {
            this.modalLoading.style.display = 'none';
        }
        if (this.modalEmbed) {
            this.modalEmbed.style.display = 'block';
        }
    }

    /**
     * Handle iframe load timeout
     */
    handleLoadTimeout(projectData) {
        console.warn('Iframe load timeout for:', projectData.title);
        this.handleIframeError(projectData);
    }

    /**
     * Handle iframe load error
     */
    handleIframeError(projectData) {
        // Clear timeout
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }

        // Hide loading
        if (this.modalLoading) {
            this.modalLoading.style.display = 'none';
        }

        // Show error message
        if (this.modalEmbed) {
            this.modalEmbed.innerHTML = `
                <div class="embed-error">
                    <div class="embed-error-icon">⚠️</div>
                    <p class="embed-error-message">
                        Unable to load sketch. Please check your connection or try opening in a new tab.
                    </p>
                    <div class="embed-error-actions">
                        <button class="embed-retry-btn">Try Again</button>
                        <a href="${projectData.embedUrl}" target="_blank" rel="noopener noreferrer" class="embed-open-btn">
                            Open in New Tab
                        </a>
                    </div>
                </div>
            `;
            this.modalEmbed.style.display = 'block';

            // Retry button handler
            const retryBtn = this.modalEmbed.querySelector('.embed-retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    this.modalEmbed.innerHTML = '';
                    this.createIframe(projectData);
                });
            }
        }
    }

    /**
     * Close modal and cleanup
     */
    close() {
        // Hide modal
        this.modal.setAttribute('data-state', 'closed');
        this.modal.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.style.overflow = '';

        // Clear timeout
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }

        // Cleanup iframe after animation completes
        setTimeout(() => {
            if (this.iframe) {
                this.iframe.remove();
                this.iframe = null;
            }
            if (this.modalEmbed) {
                this.modalEmbed.innerHTML = '';
                this.modalEmbed.style.display = 'none';
            }
            if (this.modalLoading) {
                this.modalLoading.style.display = 'flex';
            }
        }, 300); // Match CSS transition duration

        // Return focus to trigger element
        if (this.triggerElement) {
            this.triggerElement.focus();
            this.triggerElement = null;
        }

        this.currentProjectId = null;
    }
}
