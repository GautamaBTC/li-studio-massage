/**
 * Initializes mobile menu functionality.
 * Toggles the 'active' class on the navigation menu when the burger icon is clicked.
 * Closes the menu when a navigation link is clicked.
 */
const initMobileMenu = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const closeBtn = document.querySelector('.nav-close');
    if (!burger || !nav || !closeBtn) return;

    let isClosing = false;

    const openMenu = () => {
        document.body.classList.remove('menu-is-closing');
        document.body.classList.add('menu-open');
        burger.style.opacity = '0';
        burger.style.pointerEvents = 'none';

        const lastLink = nav.querySelector('a:nth-child(6)');
        if (lastLink) {
            lastLink.addEventListener('transitionend', (e) => {
                if (e.target === lastLink && document.body.classList.contains('menu-open')) {
                    closeBtn.classList.add('is-visible');
                }
            }, { once: true });
        }
    };

    const closeMenu = () => {
        if (isClosing || !document.body.classList.contains('menu-open')) return;

        isClosing = true;
        closeBtn.classList.add('is-dissolving');
        document.body.classList.add('menu-is-closing');
        document.body.classList.remove('menu-open');

        const lastMenuLink = nav.querySelector('a:nth-child(2)');

        const onTransitionEnd = () => {
            document.body.classList.remove('menu-is-closing');
            burger.style.opacity = '1';
            burger.style.pointerEvents = 'auto';
            closeBtn.classList.remove('is-visible', 'is-dissolving');
            isClosing = false;
        };

        if (lastMenuLink) {
            lastMenuLink.addEventListener('transitionend', onTransitionEnd, { once: true });
        } else {
            setTimeout(onTransitionEnd, 800);
        }
    };

    burger.addEventListener('click', () => {
        if (!document.body.classList.contains('menu-open')) {
            openMenu();
        }
    });

    closeBtn.addEventListener('click', closeMenu);

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
