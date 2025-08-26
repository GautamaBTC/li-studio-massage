/**
 * @file Handles lazy loading of elements, such as background images.
 */

/**
 * Initializes lazy loading for service card background images.
 */
const initServiceCardLazyLoad = () => {
    const serviceCards = document.querySelectorAll('.service-card');

    if (!("IntersectionObserver" in window)) {
        // Fallback for older browsers: load all images immediately.
        serviceCards.forEach(card => {
            const bg = card.querySelector('.service-card__bg');
            if (bg) {
                bg.classList.add('lazy-loaded');
            }
        });
        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const bg = card.querySelector('.service-card__bg');
                if (bg) {
                    bg.classList.add('lazy-loaded');
                }
                observer.unobserve(card); // Stop observing once loaded
            }
        });
    }, { rootMargin: "0px 0px 200px 0px" }); // Start loading when 200px from viewport

    serviceCards.forEach(card => {
        observer.observe(card);
    });
};


/**
 * Initializes all lazy loading functionality.
 */
export const initLazyLoad = () => {
    initServiceCardLazyLoad();
};
