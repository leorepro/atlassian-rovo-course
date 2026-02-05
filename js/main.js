/**
 * Atlassian Rovo Course - Main JavaScript
 */

/**
 * Creates observer options for intersection observer
 * @param {number} threshold - Visibility threshold (0-1)
 * @param {string} rootMargin - CSS margin string for root element
 * @returns {Object} Observer options object
 */
function createObserverOptions(threshold = 0.1, rootMargin = '0px 0px -50px 0px') {
    return {
        threshold,
        rootMargin
    };
}

/**
 * Applies initial fade-in styles to an element
 * @param {HTMLElement} element - The element to style
 * @param {number} translateY - Initial translateY value in pixels
 * @param {number} duration - Animation duration in seconds
 */
function applyFadeInStyles(element, translateY = 20, duration = 0.6) {
    if (!element) return;
    element.style.opacity = '0';
    element.style.transform = `translateY(${translateY}px)`;
    element.style.transition = `opacity ${duration}s ease, transform ${duration}s ease`;
}

/**
 * Reveals an element by setting opacity and removing transform
 * @param {HTMLElement} element - The element to reveal
 */
function revealElement(element) {
    if (!element) return;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

/**
 * Extracts the course ID from a tab element
 * @param {HTMLElement} tab - The tab element
 * @returns {string|null} The course ID or null if not found
 */
function getCourseIdFromTab(tab) {
    if (!tab) return null;
    return tab.getAttribute('data-course');
}

/**
 * Activates a tab and its corresponding content
 * @param {HTMLElement} tab - The tab to activate
 * @param {NodeList|Array} allTabs - All tab elements
 * @param {NodeList|Array} allContents - All content elements
 * @param {Document} doc - Document object for getElementById
 */
function activateTab(tab, allTabs, allContents, doc = document) {
    if (!tab) return;
    
    // Remove active from all tabs
    allTabs.forEach(t => t.classList.remove('active'));
    // Add active to clicked tab
    tab.classList.add('active');
    
    // Hide all course content
    allContents.forEach(content => content.classList.remove('active'));
    
    // Show selected course content
    const courseId = getCourseIdFromTab(tab);
    if (courseId) {
        const contentElement = doc.getElementById(courseId);
        if (contentElement) {
            contentElement.classList.add('active');
        }
    }
}

// Export for testing (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createObserverOptions,
        applyFadeInStyles,
        revealElement,
        getCourseIdFromTab,
        activateTab
    };
}

// Browser initialization - only run if DOM is available
if (typeof document !== 'undefined' && document.querySelectorAll) {
    // Course Tab Switching
    document.querySelectorAll('.course-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const allTabs = document.querySelectorAll('.course-tab');
            const allContents = document.querySelectorAll('.course-content');
            activateTab(tab, allTabs, allContents, document);

            // Scroll to top of content
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = createObserverOptions();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealElement(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.pain-card, .curriculum-card, .audience-card').forEach(el => {
        applyFadeInStyles(el);
        observer.observe(el);
    });
}
