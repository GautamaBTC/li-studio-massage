/**
 * @file Provides a utility for fetching data with localStorage caching and a TTL.
 */

const TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetches data from a URL with a cache-first strategy.
 * If fresh data exists in localStorage, it's returned.
 * Otherwise, it fetches from the network, caches the result, and returns it.
 * @param {string} url - The URL to fetch data from.
 * @param {string} cacheKey - The key to use for localStorage.
 * @returns {Promise<any>} A promise that resolves to the JSON data.
 * @throws {Error} Throws an error if the network request fails.
 */
export const fetchWithCache = async (url, cacheKey) => {
    const cachedItemStr = localStorage.getItem(cacheKey);

    if (cachedItemStr) {
        try {
            const cachedItem = JSON.parse(cachedItemStr);
            const isCacheFresh = (Date.now() - cachedItem.timestamp) < TTL;
            if (isCacheFresh) {
                // console.log(`Returning fresh data from cache for: ${cacheKey}`);
                return cachedItem.data;
            }
        } catch (e) {
            console.error("Failed to parse cached data:", e);
            // In case of parsing error, proceed to fetch from network
        }
    }

    // console.log(`Fetching fresh data from network for: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const itemToCache = {
        timestamp: Date.now(),
        data: data,
    };
    localStorage.setItem(cacheKey, JSON.stringify(itemToCache));

    return data;
};
