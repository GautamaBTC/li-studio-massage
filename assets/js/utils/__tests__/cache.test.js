import { fetchWithCache } from '../cache';

// Mock fetch
global.fetch = jest.fn();

describe('fetchWithCache', () => {
    const URL = 'test.json';
    const CACHE_KEY = 'test-cache';
    const MOCK_DATA = { message: 'success' };
    const TTL = 24 * 60 * 60 * 1000;

    beforeEach(() => {
        fetch.mockClear();
        localStorage.clear();
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(MOCK_DATA),
        });
    });

    test('should fetch from network if cache is empty', async () => {
        const data = await fetchWithCache(URL, CACHE_KEY);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(URL);
        expect(data).toEqual(MOCK_DATA);
    });

    test('should save fetched data to localStorage', async () => {
        await fetchWithCache(URL, CACHE_KEY);
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
        expect(cached.data).toEqual(MOCK_DATA);
        expect(cached.timestamp).toBeCloseTo(Date.now());
    });

    test('should return data from cache if it is fresh', async () => {
        // First call to cache the data
        await fetchWithCache(URL, CACHE_KEY);
        expect(fetch).toHaveBeenCalledTimes(1);

        // Second call should hit the cache
        const data = await fetchWithCache(URL, CACHE_KEY);
        expect(fetch).toHaveBeenCalledTimes(1); // Not called again
        expect(data).toEqual(MOCK_DATA);
    });

    test('should fetch from network if cache is stale', async () => {
        const staleData = {
            timestamp: Date.now() - TTL - 1000, // Older than 24 hours
            data: { message: 'stale' }
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(staleData));

        const data = await fetchWithCache(URL, CACHE_KEY);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(data).toEqual(MOCK_DATA); // Fetched new data
    });

    test('should handle fetch throwing an error', async () => {
        fetch.mockRejectedValue(new Error('Network failure'));
        await expect(fetchWithCache(URL, CACHE_KEY)).rejects.toThrow('Network failure');
    });
});
