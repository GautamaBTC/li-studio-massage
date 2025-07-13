// Ждем, пока весь HTML-документ будет загружен и готов
document.addEventListener('DOMContentLoaded', function() {

    const servicesGrid = document.getElementById('services-grid');
    
    // Функция для загрузки данных об услугах из JSON-файла
    async function loadServices() {
        try {
            const response = await fetch('services.json'); // Загружаем наш файл
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const services = await response.json(); // Превращаем ответ в JavaScript-объект

            // Очищаем скелетоны перед вставкой реальных данных
            servicesGrid.innerHTML = ''; 

            // Для каждой услуги из файла создаем HTML-карточку
            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <h3 class="service-card__title">${service.title}</h3>
                    <p class="service-card__price">${service.price}</p>
                    <a class="btn header__btn">Подробнее</a>
                `;
                servicesGrid.appendChild(card);
            });

        } catch (error) {
            console.error("Не удалось загрузить данные об услугах:", error);
            servicesGrid.innerHTML = '<p>Не удалось загрузить услуги. Попробуйте обновить страницу.</p>';
        }
    }

    // Имитируем задержку загрузки, чтобы увидеть shimmer-эффект
    // В реальном проекте этой задержки не будет, но для демонстрации - идеально.
    if (servicesGrid) {
        setTimeout(() => {
            loadServices();
        }, 1500); // 1.5 секунды
    }

});
