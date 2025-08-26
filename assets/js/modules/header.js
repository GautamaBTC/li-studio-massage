/**
 * Initializes mobile menu functionality.
 * Toggles the 'active' class on the navigation menu when the burger icon is clicked.
 * Closes the menu when a navigation link is clicked.
 */
const initMobileMenu = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        // This will be fixed in the bug fixing step
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
};

/**
 * Initializes the sticky header functionality.
 * Adds a 'scrolled' class to the header when the user scrolls down more than 50 pixels.
 */
const initStickyHeader = () => {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
};

/**
 * Initializes all header-related functionalities.
 */
export const initHeader = () => {
    initMobileMenu();
    initStickyHeader();
};
