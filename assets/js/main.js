document.addEventListener('DOMContentLoaded', function() {

    // --- ЭЛЕМЕНТЫ DOM ---
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav');
    const servicesGrid = document.getElementById('services-grid');
    const modal = document.getElementById('service-modal');
    const reviewsWrapper = document.getElementById('reviews-wrapper');

    // --- ЛОГИКА МОБИЛЬНОГО МЕНЮ ---
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Блокируем скролл при открытом меню
        });

        // Закрываем меню при клике на ссылку
        navMenu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
    
    // Остальной код остается без изменений, но я привожу его для полноты
    if (!servicesGrid || !modal) {
        console.warn("Элементы для услуг или модального окна не найдены.");
    }

    const modalContent = modal ? modal.querySelector('.modal__content') : null;
    let servicesData = []; 

    function openModal() {
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
    
    async function loadAndRenderServices() {
        if (!servicesGrid) return;
        try {
            const response = await fetch('services.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            servicesData = await response.json();
            
            servicesGrid.innerHTML = ''; 
            servicesData.forEach((service, index) => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.dataset.index = index;
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

    function showServiceDetails(serviceIndex) {
        const service = servicesData[serviceIndex];
        if (!service || !modalContent) return;

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

    async function loadAndRenderReviews() {
        if (!reviewsWrapper) return;
        try {
            const response = await fetch('reviews.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const reviews = await response.json();

            reviews.forEach(review => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `
                    <div class="review-card">
                        <p class="review-card__text">${review.text}</p>
                        <p class="review-card__author">${review.author}</p>
                    </div>
                `;
                reviewsWrapper.appendChild(slide);
            });
            
            initReviewsSlider();

        } catch(error) {
            console.error("Не удалось загрузить отзывы:", error);
            reviewsWrapper.innerHTML = "<p>Не удалось загрузить отзывы.</p>";
        }
    }

    function initReviewsSlider() {
        new Swiper('.reviews__slider', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    function initMap() {
        ymaps.ready(function () {
            const coords = [61.702171, 30.688579];
            var myMap = new ymaps.Map('map', {
                center: coords,
                zoom: 17
            });
            var myPlacemark = new ymaps.Placemark(coords, { 
                hintContent: 'Li-Студия массажного искусства',
                balloonContent: 'г. Сортавала, ул. Карельская, д. 11'
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'https://img.icons8.com/ios-filled/50/8A9A5B/spa-flower.png', 
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -40]
            });
            myMap.geoObjects.add(myPlacemark);
            myMap.behaviors.disable('scrollZoom');
        });
    }

    setTimeout(loadAndRenderServices, 1000);
    loadAndRenderReviews();
    
    if (document.getElementById('map')) {
        initMap();
    }
    
    if (servicesGrid) {
        servicesGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.service-card');
            if (card) showServiceDetails(card.dataset.index);
        });
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target.dataset.close) closeModal();
        });
    }
    
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

});
