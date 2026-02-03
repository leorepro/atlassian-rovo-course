/**
 * Atlassian Rovo Course - Main JavaScript
 */

// Course Tab Switching
document.querySelectorAll('.course-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active from all tabs
        document.querySelectorAll('.course-tab').forEach(t => t.classList.remove('active'));
        // Add active to clicked tab
        tab.classList.add('active');

        // Hide all course content
        document.querySelectorAll('.course-content').forEach(content => content.classList.remove('active'));
        // Show selected course content
        const courseId = tab.getAttribute('data-course');
        document.getElementById(courseId).classList.add('active');

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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.pain-card, .curriculum-card, .audience-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
