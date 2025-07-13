document.addEventListener('DOMContentLoaded', function() {

    const servicesGrid = document.getElementById('services-grid');
    const modal = document.getElementById('service-modal');
    const modalContent = modal.querySelector('.modal__content');
    
    let servicesData = []; // Сохраним загруженные данные здесь

    // Функция для открытия модального окна
    function openModal() {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Блокируем скролл фона
    }

    // Функция для закрытия модального окна
    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto'; // Возвращаем скролл фона
    }

    // Функция для загрузки данных об услугах из JSON-файла
    async function loadServices() {
        try {
            const response = await fetch('services.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            servicesData = await response.json(); // Сохраняем данные в переменную

            renderServiceCards(servicesData);

        } catch (error) {
            console.error("Не удалось загрузить данные об услугах:", error);
            if(servicesGrid) servicesGrid.innerHTML = '<p>Не удалось загрузить услуги. Попробуйте обновить страницу.</p>';
        }
    }

    // Функция для отрисовки карточек услуг
    function renderServiceCards(services) {
        if (!servicesGrid) return;
        servicesGrid.innerHTML = ''; 

        services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.dataset.index = index; // Добавляем data-атрибут с индексом услуги

            card.innerHTML = `
                <h3 class="service-card__title">${service.title}</h3>
                <p class="service-card__price">${service.price}</p>
                <a class="btn header__btn">Подробнее</a>
            `;
            servicesGrid.appendChild(card);
        });
    }

    // Функция для наполнения и показа модального окна
    function showServiceDetails(serviceIndex) {
        const service = servicesData[serviceIndex];
        if (!service) return;

        // Формируем HTML для списков
        const includesList = service.includes.map(item => `<li>${item}</li>`).join('');
        const effectsList = service.effects.map(item => `<li>${item}</li>`).join('');

        modalContent.innerHTML = `
            <button class="modal__close" data-close="true">&times;</button>
            <h2 class="modal-service__title">${service.title}</h2>
            <p class="modal-service__price">${service.price}</p>
            <p>${service.shortDescription}</p>

            <h3 class="modal-service__subtitle">В процедуру входит:</h3>
            <ul class="modal-service__list">${includesList}</ul>

            <h3 class="modal-service__subtitle">Преимущества и эффекты:</h3>
            <ul class="modal-service__list">${effectsList}</ul>

            <h3 class="modal-service__subtitle">Особенности и рекомендации:</h3>
            <p class="modal-service__features">${service.features}</p>
            
            <p class="modal-service__final">${service.finalParagraph}</p>
            <a href="https://wa.me/79215232545?text=Здравствуйте, хочу записаться на услугу: ${encodeURIComponent(service.title)}" target="_blank" class="btn btn--primary" style="margin-top: 1.5rem; display: block;">Записаться</a>
        `;
        openModal();
    }

    // === ОБРАБОТЧИКИ СОБЫТИЙ ===

    // Загружаем услуги (с имитацией задержки для показа скелетона)
    if (servicesGrid) {
        setTimeout(loadServices, 1500);
    }
    
    // Делегирование событий: слушаем клики на всей сетке услуг
    if (servicesGrid) {
        servicesGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.service-card');
            if (card) {
                const serviceIndex = card.dataset.index;
                showServiceDetails(serviceIndex);
            }
        });
    }

    // Слушаем клики на всем модальном окне для закрытия
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target.dataset.close) {
                closeModal();
            }
        });
    }
    
    // Закрытие модального окна по клавише Escape
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

});
