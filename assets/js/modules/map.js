/**
 * Renders a fallback content in the map container.
 * @param {HTMLElement} container - The map container element.
 */
const showMapFallback = (container) => {
    container.style.cssText = "display: flex; align-items: center; justify-content: center; text-align: center; background-color: #e2e8f0; color: #4a5568; border-radius: 8px;";
    container.innerHTML = `<p>Не удалось загрузить карту.<br>Наш адрес: г. Сортавала, ул. Карельская, д. 11</p>`;
};

/**
 * Initializes the Yandex Map with robust error handling and a fallback.
 */
export const initMap = () => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Set a timeout to catch script loading failures
    const timeoutId = setTimeout(() => {
        // If the map container is still empty after 5 seconds, show fallback
        const isMapLoaded = mapContainer.querySelector('ymaps');
        if (!isMapLoaded) {
             console.error("Yandex Maps API loading timed out.");
             showMapFallback(mapContainer);
        }
    }, 5000);

    try {
        // ymaps.ready will wait for the API to be available
        ymaps.ready(() => {
            clearTimeout(timeoutId); // API is ready, cancel the timeout
            try {
                // Clear container in case fallback was rendered but API loaded late
                mapContainer.innerHTML = '';
                mapContainer.style.cssText = ''; // Clear fallback styles

                const myMap = new ymaps.Map(mapContainer, { center: [61.702171, 30.688579], zoom: 17 });
                myMap.geoObjects.add(new ymaps.Placemark([61.702171, 30.688579]));
            } catch (e) {
                console.error('Failed to initialize Yandex Map:', e);
                showMapFallback(mapContainer);
            }
        });
    } catch (e) {
        // This catches the case where the ymaps object itself is not defined,
        // meaning the script likely failed to load at all.
        console.error('Yandex Maps script not available:', e);
        clearTimeout(timeoutId);
        showMapFallback(mapContainer);
    }
};
