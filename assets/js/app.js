import { initHeader } from './modules/header.js';
import { initTheme } from './modules/theme.js';
import { initServices } from './modules/services.js';
import { initReviews } from './modules/reviews.js';
import { initMap } from './modules/map.js';
import { initAnimations } from './modules/animations.js';
import { initLazyLoad } from './modules/lazyload.js';

/**
 * The main entry point for the application.
 * It waits for the DOM to be fully loaded and then initializes all modules.
 * @listens document:DOMContentLoaded
 */
const main = () => {
    document.addEventListener('DOMContentLoaded', async () => {
        initTheme();
        initHeader();
        const servicesLoaded = await initServices();
        if (servicesLoaded) {
            // Init features that depend on service cards being present
            initAnimations();
            initLazyLoad();
        }
        initReviews();
        initMap();
    });
};

main();
