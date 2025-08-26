/**
 * Renders the review cards into the DOM.
 * @param {Array<Object>} reviews - An array of review objects.
 * @param {string} reviews[].text - The text of the review.
 * @param {string} reviews[].author - The author of the review.
 */
const renderReviews = (reviews) => {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <p>"${review.text}"</p>
            <p><strong>- ${review.author}</strong></p>
        </div>
    `).join('');
};

import { fetchWithCache } from '../utils/cache.js';

/**
 * Fetches review data (from cache or network) and initializes the reviews section.
 * Renders the reviews or an error message if the fetch fails.
 * @returns {Promise<void>}
 */
export const initReviews = async () => {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    try {
        const reviews = await fetchWithCache('reviews.json', 'reviews-cache');
        renderReviews(reviews);
    } catch (error) {
        console.error("Failed to load reviews:", error);
        container.innerHTML = '<p class="text-center">Не удалось загрузить отзывы. Попробуйте обновить страницу.</p>';
    }
};
