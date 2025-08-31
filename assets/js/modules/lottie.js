/**
 * @file Manages the Lottie animations for social media icons.
 */

/**
 * Loads a Lottie animation into a container and sets up hover events.
 * @param {string} containerId - The ID of the DOM element to contain the animation.
 * @param {string} path - The path to the Lottie JSON file.
 */
const loadLottieIcon = (containerId, path) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: path
    });

    container.addEventListener('mouseenter', () => {
        anim.setDirection(1);
        anim.play();
    });

    container.addEventListener('mouseleave', () => {
        anim.setDirection(-1);
        anim.play();
    });
};

/**
 * Initializes all Lottie icons for the site.
 */
export const initLottieIcons = () => {
    const icons = [
        { name: 'vk', path: 'assets/lottie/vk.json' },
        { name: 'whatsapp', path: 'assets/lottie/whatsapp.json' },
        { name: 'telegram', path: 'assets/lottie/telegram.json' },
        { name: 'instagram', path: 'assets/lottie/instagram.json' }
    ];

    icons.forEach(icon => {
        loadLottieIcon(`lottie-${icon.name}`, icon.path);
    });
};
