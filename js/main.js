/**
 * Atlassian Rovo Course - Main JavaScript
 */

// Course Tab Switching with Accessibility Support
const tabs = document.querySelectorAll('.course-tab');
const tabList = document.querySelector('.nav-tabs');

/**
 * Activates a tab and shows corresponding panel
 * @param {HTMLElement} tab - The tab element to activate
 */
function activateTab(tab) {
    // Update ARIA attributes on all tabs
    tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
    });
    
    // Activate the selected tab
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    // Hide all course content
    document.querySelectorAll('.course-content').forEach(content => content.classList.remove('active'));
    
    // Show selected course content (with null check)
    const courseId = tab.getAttribute('data-course');
    const courseElement = document.getElementById(courseId);
    if (courseElement) {
        courseElement.classList.add('active');
    }

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Click event handler for tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        activateTab(tab);
    });
});

// Keyboard navigation for tabs (WCAG 2.1.1 compliance)
tabList.addEventListener('keydown', (e) => {
    const currentTab = document.activeElement;
    if (!currentTab.classList.contains('course-tab')) return;

    const tabsArray = Array.from(tabs);
    const currentIndex = tabsArray.indexOf(currentTab);
    let nextIndex;

    switch (e.key) {
        case 'ArrowRight':
            e.preventDefault();
            nextIndex = (currentIndex + 1) % tabsArray.length;
            activateTab(tabsArray[nextIndex]);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
            activateTab(tabsArray[nextIndex]);
            break;
        case 'Home':
            e.preventDefault();
            activateTab(tabsArray[0]);
            break;
        case 'End':
            e.preventDefault();
            activateTab(tabsArray[tabsArray.length - 1]);
            break;
    }
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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Unobserve after animation to prevent memory leak
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.pain-card, .curriculum-card, .audience-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
