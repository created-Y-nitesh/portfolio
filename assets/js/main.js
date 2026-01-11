/* ============================================
   MAIN.JS - Advanced Portfolio JavaScript
   Complete Functionality & Interactions
   Production-Ready Code
   ============================================ */

'use strict';

// ============================================
// DOM ELEMENTS CACHING
// ============================================

const DOM = {
    navbar: document.getElementById('navbar'),
    logo: document.getElementById('logo'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    navItems: document.querySelectorAll('.nav-item'),
    navLinks: document.querySelectorAll('.nav-link'),
    scrollBtns: document.querySelectorAll('.scroll-btn'),
    hero: document.querySelector('.hero'),
    features: document.querySelector('.features'),
    projects: document.querySelector('.projects'),
    projectCards: document.querySelectorAll('.project-card'),
    featureCards: document.querySelectorAll('.feature-card'),
    cta: document.querySelector('.cta'),
    footer: document.querySelector('.footer'),
    body: document.body
};

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

const CONFIG = {
    navbarHeight: 70,
    mobileBreakpoint: 768,
    animationDuration: 600,
    scrollBehavior: 'smooth',
    debounceDelay: 250,
    scrollThrottle: 100,
    observerOptions: {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
    if (!element) return;

    const offsetTop = element.offsetTop - CONFIG.navbarHeight;

    window.scrollTo({
        top: offsetTop,
        behavior: CONFIG.scrollBehavior
    });
}

/**
 * Add class to element with animation
 */
function addClassWithAnimation(element, className) {
    if (!element) return;
    element.classList.add(className);
}

/**
 * Remove class from element
 */
function removeClassFromAll(selector, className) {
    document.querySelectorAll(selector).forEach(el => {
        el.classList.remove(className);
    });
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * Get scroll position
 */
function getScrollPosition() {
    return window.scrollY || window.pageYOffset;
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
    return window.innerWidth < CONFIG.mobileBreakpoint;
}

// ============================================
// NAVBAR FUNCTIONALITY
// ============================================

/**
 * Initialize navbar
 */
function initNavbar() {
    if (!DOM.hamburger || !DOM.navMenu) return;

    // Hamburger menu toggle
    DOM.hamburger.addEventListener('click', toggleHamburger);

    // Close menu when nav link is clicked
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', closeHamburger);
    });

    // Close menu on window resize
    window.addEventListener('resize', handleWindowResize);

    // Navbar scroll effect
    window.addEventListener('scroll', throttle(handleNavbarScroll, CONFIG.scrollThrottle));
}

/**
 * Toggle hamburger menu
 */
function toggleHamburger() {
    DOM.hamburger.classList.toggle('active');
    DOM.navMenu.classList.toggle('active');
}

/**
 * Close hamburger menu
 */
function closeHamburger() {
    DOM.hamburger.classList.remove('active');
    DOM.navMenu.classList.remove('active');
}

/**
 * Handle navbar scroll effects
 */
function handleNavbarScroll() {
    const scrollPos = getScrollPosition();
    const isScrolling = scrollPos > 50;

    if (isScrolling) {
        DOM.navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        DOM.navbar.style.padding = '8px 0';
    } else {
        DOM.navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
        DOM.navbar.style.padding = '12px 0';
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
}

/**
 * Update active nav link based on scroll
 */
function updateActiveNavLink() {
    const scrollPos = getScrollPosition() + CONFIG.navbarHeight + 100;

    const sections = [
        { element: DOM.hero, id: 'home' },
        { element: DOM.features, id: 'features' },
        { element: DOM.projects, id: 'projects' }
    ];

    sections.forEach(section => {
        if (section.element) {
            const { top, bottom } = section.element.getBoundingClientRect();

            if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
                removeClassFromAll('.nav-link', 'active');
                const activeLink = document.querySelector(`a[href="#${section.id}"]`);
                if (activeLink) {
                    activeLink.parentElement.classList.add('active');
                }
            }
        }
    });
}

/**
 * Handle window resize
 */
function handleWindowResize() {
    if (window.innerWidth >= CONFIG.mobileBreakpoint) {
        closeHamburger();
    }
}

// ============================================
// SCROLL FUNCTIONALITY
// ============================================

/**
 * Initialize scroll buttons
 */
function initScrollButtons() {
    DOM.scrollBtns.forEach(btn => {
        btn.addEventListener('click', handleScrollClick);
    });
}

/**
 * Handle scroll button clicks
 */
function handleScrollClick(e) {
    e.preventDefault();

    const href = this.getAttribute('href');
    const targetElement = document.querySelector(href);

    if (targetElement) {
        smoothScrollTo(targetElement);
        closeHamburger();
    }
}

/**
 * Scroll to top functionality
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: CONFIG.scrollBehavior
    });
}

// ============================================
// INTERSECTION OBSERVER - LAZY LOADING & ANIMATIONS
// ============================================

/**
 * Initialize intersection observer for animations
 */
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation when element enters viewport
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Remove observer to prevent re-animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// IMAGE LAZY LOADING
// ============================================

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ============================================
// DARK MODE SUPPORT
// ============================================

/**
 * Initialize dark mode
 */
function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');

    // Apply saved theme or system preference
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark.matches) {
        applyTheme('dark');
    }

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
    });
}

/**
 * Apply theme to document
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        DOM.body.setAttribute('data-color-scheme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        DOM.body.setAttribute('data-color-scheme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// ============================================
// PROJECT FILTERING (Future Enhancement)
// ============================================

/**
 * Initialize project filtering
 */
function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('[data-filter]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleProjectFilter);
    });
}

/**
 * Handle project filter
 */
function handleProjectFilter(e) {
    const filter = e.target.dataset.filter;

    DOM.projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ============================================
// FORM HANDLING
// ============================================

/**
 * Initialize form handling
 */
function initFormHandling() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('[type="submit"]');

    if (!submitBtn) return;

    // Disable button and show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        // Replace with your actual form submission endpoint
        const response = await fetch(form.action, {
            method: form.method,
            body: formData
        });

        if (response.ok) {
            showNotification('Message sent successfully!', 'success');
            form.reset();
        } else {
            showNotification('Failed to send message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('An error occurred. Please try again later.', 'error');
    } finally {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;

    DOM.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// COPY TO CLIPBOARD
// ============================================

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text, element) {
    try {
        await navigator.clipboard.writeText(text);

        const originalText = element.textContent;
        element.textContent = 'Copied!';

        setTimeout(() => {
            element.textContent = originalText;
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        showNotification('Failed to copy to clipboard', 'error');
    }
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

/**
 * Track button clicks
 */
function initAnalytics() {
    const buttons = document.querySelectorAll('button, a[href*="contact"], a[href*="projects"]');

    buttons.forEach(btn => {
        btn.addEventListener('click', trackEvent);
    });
}

/**
 * Track event
 */
function trackEvent(e) {
    const element = e.target;
    const eventData = {
        timestamp: new Date().toISOString(),
        element: element.tagName,
        text: element.textContent.trim(),
        href: element.href || null
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Event tracked:', eventData);
    }

    // Send to analytics service (replace with your service)
    // sendAnalytics(eventData);
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

/**
 * Monitor performance metrics
 */
function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        try {
            // Monitor long tasks
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.warn('Long task detected:', entry.duration);
                }
            });

            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            console.log('Performance monitoring not available');
        }
    }

    // Log Core Web Vitals
    logCoreWebVitals();
}

/**
 * Log Core Web Vitals
 */
function logCoreWebVitals() {
    if ('web-vital' in window) {
        // This would require importing web-vitals library
        console.log('Core Web Vitals monitoring enabled');
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyboardShortcut);
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcut(e) {
    // Skip if user is typing in an input
    if (e.target.matches('input, textarea')) return;

    switch (e.key) {
        case '/':
            e.preventDefault();
            // Open search or command palette
            console.log('Command palette opened');
            break;
        case 'Escape':
            closeHamburger();
            break;
        case 'Home':
            e.preventDefault();
            smoothScrollTo(DOM.hero);
            break;
        case 'End':
            e.preventDefault();
            smoothScrollTo(DOM.footer);
            break;
    }
}

// ============================================
// SMOOTH ANIMATIONS ON LOAD
// ============================================

/**
 * Initialize page load animations
 */
function initPageLoadAnimation() {
    // Fade in body
    DOM.body.style.opacity = '0';

    // Wait for DOM to be fully rendered
    window.addEventListener('load', () => {
        DOM.body.style.transition = 'opacity 0.6s ease-out';
        DOM.body.style.opacity = '1';
    });
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

/**
 * Initialize scroll progress bar
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-teal-500), var(--color-orange-500));
        z-index: 999;
        width: 0%;
        transition: width 0.1s ease;
    `;

    DOM.body.appendChild(progressBar);

    window.addEventListener('scroll', throttle(() => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (getScrollPosition() / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, 50));
}

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

/**
 * Register service worker for offline support
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all features
 */
function initialize() {
    console.log('🚀 Portfolio initialized');

    // Core functionality
    initNavbar();
    initScrollButtons();
    initFormHandling();

    // Animations & Performance
    initIntersectionObserver();
    initLazyLoading();
    initPageLoadAnimation();
    initScrollProgress();

    // Theme & Accessibility
    initDarkMode();
    initKeyboardShortcuts();

    // Analytics & Monitoring
    initAnalytics();
    initPerformanceMonitoring();

    // Optional: Service worker for offline support
    // registerServiceWorker();

    // Update active nav link on load
    updateActiveNavLink();
}

// ============================================
// DOM READY
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// ============================================
// EXPORT FOR MODULAR USE (if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        smoothScrollTo,
        showNotification,
        copyToClipboard,
        isMobileDevice,
        debounce,
        throttle
    };
}

/* ============================================
   END MAIN.JS
   ============================================ */