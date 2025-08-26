/**
 * @file Manages the light/dark theme of the application.
 */

const THEME_STORAGE_KEY = 'li-studio-theme';

/**
 * Applies the selected theme by setting the 'data-theme' attribute on the html element.
 * @param {string} theme - The theme to apply ('light' or 'dark').
 */
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
};

/**
 * Saves the user's theme preference to localStorage.
 * @param {string} theme - The theme to save.
 */
const saveTheme = (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};

/**
 * Gets the preferred theme based on saved preference or OS setting.
 * @returns {string} The preferred theme ('light' or 'dark').
 */
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
        return savedTheme;
    }
    // If no saved theme, use OS preference. Default to dark if no preference.
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

/**
 * Initializes the theme switcher functionality.
 * - Sets the initial theme based on user preference or OS setting.
 * - Adds a click listener to the theme toggle button.
 * - Listens for changes in OS theme preference.
 */
export const initTheme = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // 1. Set initial theme on page load
    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    // 2. Add click listener for manual toggling
    themeToggle.addEventListener('click', () => {
        // Add spinning class for animation
        themeToggle.classList.add('is-spinning');

        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        saveTheme(newTheme);

        // Remove the class after the animation completes
        themeToggle.addEventListener('transitionend', () => {
            themeToggle.classList.remove('is-spinning');
        }, { once: true });
    });

    // 3. Listen for OS-level theme changes
    // This will only apply if the user has NOT manually overridden the theme.
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        const isThemeSaved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!isThemeSaved) {
            const newTheme = e.matches ? 'light' : 'dark';
            applyTheme(newTheme);
        }
    });
};
