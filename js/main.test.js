/**
 * @jest-environment jsdom
 */

// Mock IntersectionObserver which is not available in jsdom
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
};

const {
    createObserverOptions,
    applyFadeInStyles,
    revealElement,
    getCourseIdFromTab,
    activateTab
} = require('./main.js');

describe('createObserverOptions', () => {
    test('returns default options when no arguments provided', () => {
        const options = createObserverOptions();
        expect(options.threshold).toBe(0.1);
        expect(options.rootMargin).toBe('0px 0px -50px 0px');
    });

    test('returns custom options when arguments provided', () => {
        const options = createObserverOptions(0.5, '10px 10px 10px 10px');
        expect(options.threshold).toBe(0.5);
        expect(options.rootMargin).toBe('10px 10px 10px 10px');
    });
});

describe('applyFadeInStyles', () => {
    test('applies default fade-in styles to element', () => {
        const element = document.createElement('div');
        applyFadeInStyles(element);
        
        expect(element.style.opacity).toBe('0');
        expect(element.style.transform).toBe('translateY(20px)');
        expect(element.style.transition).toBe('opacity 0.6s ease, transform 0.6s ease');
    });

    test('applies custom fade-in styles', () => {
        const element = document.createElement('div');
        applyFadeInStyles(element, 30, 1);
        
        expect(element.style.opacity).toBe('0');
        expect(element.style.transform).toBe('translateY(30px)');
        expect(element.style.transition).toBe('opacity 1s ease, transform 1s ease');
    });

    test('handles null element gracefully', () => {
        expect(() => applyFadeInStyles(null)).not.toThrow();
    });

    test('handles undefined element gracefully', () => {
        expect(() => applyFadeInStyles(undefined)).not.toThrow();
    });
});

describe('revealElement', () => {
    test('sets opacity to 1 and removes transform', () => {
        const element = document.createElement('div');
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        revealElement(element);
        
        expect(element.style.opacity).toBe('1');
        expect(element.style.transform).toBe('translateY(0)');
    });

    test('handles null element gracefully', () => {
        expect(() => revealElement(null)).not.toThrow();
    });

    test('handles undefined element gracefully', () => {
        expect(() => revealElement(undefined)).not.toThrow();
    });
});

describe('getCourseIdFromTab', () => {
    test('returns data-course attribute value', () => {
        const tab = document.createElement('button');
        tab.setAttribute('data-course', 'course-intro');
        
        expect(getCourseIdFromTab(tab)).toBe('course-intro');
    });

    test('returns null when data-course attribute is not set', () => {
        const tab = document.createElement('button');
        
        expect(getCourseIdFromTab(tab)).toBeNull();
    });

    test('returns null for null element', () => {
        expect(getCourseIdFromTab(null)).toBeNull();
    });

    test('returns null for undefined element', () => {
        expect(getCourseIdFromTab(undefined)).toBeNull();
    });
});

describe('activateTab', () => {
    const TEST_HTML_TEMPLATE = `
        <button class="course-tab" data-course="course-1">Tab 1</button>
        <button class="course-tab active" data-course="course-2">Tab 2</button>
        <div id="course-1" class="course-content">Content 1</div>
        <div id="course-2" class="course-content active">Content 2</div>
    `;
    
    let mockDoc;
    
    beforeEach(() => {
        document.body.innerHTML = TEST_HTML_TEMPLATE;
        mockDoc = document;
    });

    test('activates clicked tab and removes active from others', () => {
        const allTabs = document.querySelectorAll('.course-tab');
        const allContents = document.querySelectorAll('.course-content');
        const tab1 = allTabs[0];
        
        activateTab(tab1, allTabs, allContents, mockDoc);
        
        expect(tab1.classList.contains('active')).toBe(true);
        expect(allTabs[1].classList.contains('active')).toBe(false);
    });

    test('shows corresponding content and hides others', () => {
        const allTabs = document.querySelectorAll('.course-tab');
        const allContents = document.querySelectorAll('.course-content');
        const tab1 = allTabs[0];
        
        activateTab(tab1, allTabs, allContents, mockDoc);
        
        const content1 = document.getElementById('course-1');
        const content2 = document.getElementById('course-2');
        
        expect(content1.classList.contains('active')).toBe(true);
        expect(content2.classList.contains('active')).toBe(false);
    });

    test('handles null tab gracefully', () => {
        const allTabs = document.querySelectorAll('.course-tab');
        const allContents = document.querySelectorAll('.course-content');
        
        expect(() => activateTab(null, allTabs, allContents, mockDoc)).not.toThrow();
    });

    test('handles tab without data-course attribute', () => {
        const tab = document.createElement('button');
        tab.classList.add('course-tab');
        const allTabs = [tab];
        const allContents = document.querySelectorAll('.course-content');
        
        expect(() => activateTab(tab, allTabs, allContents, mockDoc)).not.toThrow();
        expect(tab.classList.contains('active')).toBe(true);
    });
});
