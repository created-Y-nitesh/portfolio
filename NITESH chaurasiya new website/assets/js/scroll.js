/* ============================================
   SCROLL.JS - Advanced Scroll Features
   Scroll Effects, Parallax, Animations
   Production-Ready Scroll Management
   ============================================ */

'use strict';

// ============================================
// SCROLL MANAGER OBJECT
// ============================================

const ScrollManager = {
    // State management
    state: {
        isScrolling: false,
        scrollPosition: 0,
        maxScroll: 0,
        direction: 'down', // 'up' or 'down'
        lastScrollTop: 0,
        scrollVelocity: 0,
        isAtTop: true,
        isAtBottom: false,
        scrollPercent: 0
    },

    // Configuration
    config: {
        throttleDelay: 16, // ~60fps
        parallaxFactor: 0.5,
        revealThreshold: 0.15,
        hideNavbarThreshold: 100,
        scrollSpyOffset: 70,
        smoothScrollDuration: 800
    },

    // Initialize scroll manager
    init() {
        this.attachListeners();
        this.updateScrollState();
        this.initScrollEffects();
    },

    // ============================================
    // EVENT LISTENERS
    // ============================================

    attachListeners() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        window.addEventListener('resize', () => this.updateScrollState(), { passive: true });
        document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: true });
        document.addEventListener('touchmove', () => this.handleTouchMove(), { passive: true });
    },

    // ============================================
    // SCROLL DETECTION & STATE
    // ============================================

    handleScroll() {
        const currentScroll = window.scrollY || window.pageYOffset;

        // Detect scroll direction
        if (currentScroll > this.state.lastScrollTop) {
            this.state.direction = 'down';
        } else if (currentScroll < this.state.lastScrollTop) {
            this.state.direction = 'up';
        }

        // Calculate scroll velocity
        this.state.scrollVelocity = currentScroll - this.state.lastScrollTop;
        this.state.lastScrollTop = currentScroll;
        this.state.scrollPosition = currentScroll;

        // Update state flags
        this.state.isAtTop = currentScroll <= 0;
        this.state.isAtBottom = currentScroll >= (this.state.maxScroll - window.innerHeight);
        this.state.scrollPercent = (currentScroll / this.state.maxScroll) * 100;

        // Trigger scroll effects
        this.triggerScrollEffects();
    },

    handleWheel(e) {
        // Detect scroll direction from wheel event
        if (e.deltaY > 0) {
            this.state.direction = 'down';
        } else if (e.deltaY < 0) {
            this.state.direction = 'up';
        }
    },

    handleTouchMove() {
        // Touch scroll handling
        this.state.isScrolling = true;
        clearTimeout(this.touchTimeout);
        this.touchTimeout = setTimeout(() => {
            this.state.isScrolling = false;
        }, 150);
    },

    updateScrollState() {
        this.state.maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    },

    // ============================================
    // SCROLL EFFECTS
    // ============================================

    initScrollEffects() {
        this.initParallax();
        this.initScrollReveal();
        this.initScrollSpy();
        this.initHideOnScroll();
        this.initStickyElements();
    },

    triggerScrollEffects() {
        this.updateParallax();
        this.updateScrollReveal();
        this.updateScrollSpy();
        this.updateHideOnScroll();
        this.updateStickyElements();
    },

    // ============================================
    // PARALLAX EFFECT
    // ============================================

    initParallax() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        this.parallaxElements.forEach(el => {
            el.style.willChange = 'transform';
        });
    },

    updateParallax() {
        this.parallaxElements.forEach(el => {
            const factor = parseFloat(el.dataset.parallax) || this.config.parallaxFactor;
            const yOffset = window.scrollY * factor;
            el.style.transform = `translateY(${yOffset}px)`;
        });
    },

    // ============================================
    // SCROLL REVEAL
    // ============================================

    initScrollReveal() {
        this.revealElements = document.querySelectorAll('[data-reveal]');
        this.revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    },

    updateScrollReveal() {
        this.revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementBottom = el.getBoundingClientRect().bottom;
            const isVisible = elementTop < window.innerHeight - (window.innerHeight * this.config.revealThreshold) &&
                elementBottom > 0;

            if (isVisible) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.classList.add('revealed');
            }
        });
    },

    // ============================================
    // SCROLL SPY (Active Navigation)
    // ============================================

    initScrollSpy() {
        this.scrollSpyTargets = document.querySelectorAll('[data-scroll-spy]');
        this.scrollSpyNavs = document.querySelectorAll('[data-scroll-nav]');
    },

    updateScrollSpy() {
        let activeTarget = null;

        this.scrollSpyTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.top <= this.config.scrollSpyOffset && rect.bottom > this.config.scrollSpyOffset) {
                activeTarget = target.id;
            }
        });

        if (activeTarget) {
            this.scrollSpyNavs.forEach(nav => {
                nav.classList.remove('active');
                if (nav.getAttribute('href') === `#${activeTarget}`) {
                    nav.classList.add('active');
                }
            });
        }
    },

    // ============================================
    // HIDE ON SCROLL
    // ============================================

    initHideOnScroll() {
        this.hideOnScrollElements = document.querySelectorAll('[data-hide-on-scroll]');
    },

    updateHideOnScroll() {
        const shouldHide = this.state.direction === 'down' && this.state.scrollPosition > this.config.hideNavbarThreshold;

        this.hideOnScrollElements.forEach(el => {
            if (shouldHide) {
                el.style.transform = 'translateY(-100%)';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            } else {
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            }
        });
    },

    // ============================================
    // STICKY ELEMENTS
    // ============================================

    initStickyElements() {
        this.stickyElements = document.querySelectorAll('[data-sticky]');
        this.stickyElements.forEach(el => {
            el.dataset.originalTop = el.offsetTop;
        });
    },

    updateStickyElements() {
        this.stickyElements.forEach(el => {
            const originalTop = parseFloat(el.dataset.originalTop);
            const offsetTop = el.dataset.offset || 0;

            if (this.state.scrollPosition >= originalTop - offsetTop) {
                el.style.position = 'fixed';
                el.style.top = offsetTop + 'px';
                el.style.width = el.parentElement.offsetWidth + 'px';
                el.style.zIndex = '100';
                el.classList.add('sticky-active');
            } else {
                el.style.position = 'relative';
                el.style.top = '0';
                el.classList.remove('sticky-active');
            }
        });
    },

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Smooth scroll to element
     */
    smoothScrollToElement(element, offset = 0) {
        if (!element) return;

        const targetPosition = element.offsetTop - offset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = this.config.smoothScrollDuration;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-in-out)
            const ease = progress < 0.5 ?
                2 * progress * progress :
                -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    },

    /**
     * Get scroll percentage
     */
    getScrollPercentage() {
        return this.state.scrollPercent;
    },

    /**
     * Check if element is in viewport
     */
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= window.innerHeight &&
            rect.bottom >= 0
        );
    },

    /**
     * Scroll to top
     */
    scrollToTop(smooth = true) {
        if (smooth) {
            this.smoothScrollToElement(document.documentElement, 0);
        } else {
            window.scrollTo(0, 0);
        }
    },

    /**
     * Scroll to bottom
     */
    scrollToBottom(smooth = true) {
        const bottomElement = document.documentElement;
        if (smooth) {
            this.smoothScrollToElement(bottomElement, 0);
        } else {
            window.scrollTo(0, document.body.scrollHeight);
        }
    },

    /**
     * Get scroll direction
     */
    getScrollDirection() {
        return this.state.direction;
    },

    /**
     * Get scroll velocity
     */
    getScrollVelocity() {
        return this.state.scrollVelocity;
    }
};

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimator {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            duration: 600,
            delay: 0,
            easing: 'ease-out',
            opacity: true,
            transform: true,
            ...options
        };

        this.init();
    }

    init() {
        this.setupStyles();
        this.observeElement();
    }

    setupStyles() {
        this.element.style.opacity = this.options.opacity ? '0' : '1';
        if (this.options.transform) {
            this.element.style.transform = 'translateY(30px)';
        }
        this.element.style.transition = `
            opacity ${this.options.duration}ms ${this.options.easing} ${this.options.delay}ms,
            transform ${this.options.duration}ms ${this.options.easing} ${this.options.delay}ms
        `;
    }

    observeElement() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(this.element);
    }

    animate() {
        requestAnimationFrame(() => {
            if (this.options.opacity) {
                this.element.style.opacity = '1';
            }
            if (this.options.transform) {
                this.element.style.transform = 'translateY(0)';
            }
            this.element.classList.add('animated');
        });
    }
}

// ============================================
// SCROLL TRIGGER
// ============================================

class ScrollTrigger {
    constructor(element, callback, options = {}) {
        this.element = element;
        this.callback = callback;
        this.options = {
            threshold: 0.5,
            rootMargin: '0px',
            once: false,
            ...options
        };

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.callback(entry);
                    if (this.options.once) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });

        observer.observe(this.element);
    }
}

// ============================================
// MOMENTUM SCROLL
// ============================================

class MomentumScroll {
    constructor() {
        this.velocity = 0;
        this.friction = 0.95;
        this.init();
    }

    init() {
        window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: true });
        this.animate();
    }

    handleWheel(e) {
        this.velocity = e.deltaY;
    }

    animate() {
        if (Math.abs(this.velocity) > 0.5) {
            window.scrollBy(0, this.velocity);
            this.velocity *= this.friction;
        }
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SCROLL LOCK (Prevent scrolling)
// ============================================

class ScrollLock {
    static lock() {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    }

    static unlock() {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    static getScrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        outer.appendChild(inner);

        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        document.body.removeChild(outer);

        return scrollbarWidth;
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize ScrollManager on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ScrollManager.init();
    });
} else {
    ScrollManager.init();
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * // 1. Parallax effect
 * <div data-parallax="0.5">Element moves at 50% of scroll speed</div>
 * 
 * // 2. Scroll reveal
 * <div data-reveal>Element reveals on scroll</div>
 * 
 * // 3. Scroll spy (active nav)
 * <section id="section1" data-scroll-spy></section>
 * <a href="#section1" data-scroll-nav></a>
 * 
 * // 4. Hide on scroll
 * <nav data-hide-on-scroll>Hides when scrolling down</nav>
 * 
 * // 5. Sticky element
 * <div data-sticky data-offset="70">Sticks to top</div>
 * 
 * // 6. Scroll animations
 * const animator = new ScrollAnimator(element, {
 *     duration: 600,
 *     delay: 100
 * });
 * 
 * // 7. Scroll trigger
 * new ScrollTrigger(element, (entry) => {
 *     console.log('Element entered viewport!');
 * }, { threshold: 0.5, once: true });
 * 
 * // 8. Scroll lock
 * ScrollLock.lock();   // Prevent scrolling
 * ScrollLock.unlock(); // Enable scrolling
 * 
 * // 9. Smooth scroll
 * ScrollManager.smoothScrollToElement(element, 100);
 * 
 * // 10. Get scroll info
 * console.log(ScrollManager.getScrollPercentage());
 * console.log(ScrollManager.getScrollDirection());
 * console.log(ScrollManager.getScrollVelocity());
 */

// ============================================
// EXPORT FOR MODULAR USE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScrollManager,
        ScrollAnimator,
        ScrollTrigger,
        MomentumScroll,
        ScrollLock
    };
}

/* ============================================
   END SCROLL.JS
   ============================================ */