/**
 * Initializes mobile menu functionality.
 * Toggles the 'active' class on the navigation menu when the burger icon is clicked.
 * Closes the menu when a navigation link is clicked.
 */
const initMobileMenu = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    if (!burger || !nav) return;

    let isClosing = false;

    const openMenu = () => {
        document.body.classList.remove('menu-is-closing');
        document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
        if (isClosing || !document.body.classList.contains('menu-open')) return;

        isClosing = true;
        document.body.classList.add('menu-is-closing');
        document.body.classList.remove('menu-open');

        const lastLink = nav.querySelector('a:nth-child(2)'); // The logo has the longest delay

        const onTransitionEnd = () => {
            document.body.classList.remove('menu-is-closing');
            isClosing = false;
        };

        if (lastLink) {
            lastLink.addEventListener('transitionend', onTransitionEnd, { once: true });
        } else {
            // Fallback just in case
            setTimeout(onTransitionEnd, 800);
        }
    };

    burger.addEventListener('click', () => {
        if (document.body.classList.contains('menu-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
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
