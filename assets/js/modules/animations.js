/**
 * @file Manages all JavaScript-driven animations.
 */

/**
 * Initializes a staggered slide-in animation for elements as they enter the viewport.
 * This uses Intersection Observer to trigger the animation only once.
 * @param {string} selector - The CSS selector for the elements to animate.
 * @param {number} [delayStep=150] - The delay in ms between each element's animation.
 */
const initStaggeredAnimation = (selector, delayStep = 150) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    // Using requestAnimationFrame ensures that we initialize the observer after the
    // browser has completed its current painting cycle. This is a more robust
    // way to handle potential race conditions than a fixed setTimeout.
    requestAnimationFrame(() => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
        });

        elements.forEach((el, index) => {
            // Apply staggered delay. User requested 0.1-0.2s, so 150ms is a good middle ground.
            el.style.transitionDelay = `${index * delayStep}ms`;
            observer.observe(el);
        });
    });
};

/**
 * Initializes an alternating slide-in animation for elements as they enter the viewport.
 * @param {string} selector - The CSS selector for the elements to animate.
 */
const initAlternatingAnimation = (selector) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    elements.forEach((el, index) => {
        if (index % 2 === 0) {
            el.classList.add('slide-in-right');
        } else {
            el.classList.add('slide-in-left');
        }
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
};


/**
 * Initializes all animations for the site.
 */
export const initAnimations = () => {
    initStaggeredAnimation('.service-card');
    initAlternatingAnimation('.review-card');
};
