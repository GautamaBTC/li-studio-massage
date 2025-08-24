/**
 * @file Главный скрипт для сайта Li-Студия.
 * @author Jules (World-Class Web Dev Team)
 * @version 2.2.0
 */

const App = {
    // --- Свойства ---
    elements: {
        burger: null,
        navMenu: null,
        servicesGrid: null,
        modal: null,
        modalContent: null,
        reviewsWrapper: null,
        mapContainer: null,
        galleryGrid: null,
        lightbox: null,
        lightboxImage: null,
        lightboxClose: null,
        lightboxOverlay: null,
    },
    data: {
        services: [],
    },

    // --- Методы инициализации ---
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.collectElements();
            this.initMobileMenu();
            this.initServices();
            this.initReviews();
            this.initMap();
            this.initModalListeners();
            this.initScrollAnimations();
            this.initGalleryLightbox(); // <-- НОВЫЙ ВЫЗОВ
        });
    },

    collectElements() {
        this.elements.burger = document.querySelector('.burger');
        this.elements.navMenu = document.querySelector('.nav');
        this.elements.servicesGrid = document.getElementById('services-grid');
        this.elements.modal = document.getElementById('service-modal');
        this.elements.modalContent = this.elements.modal ? this.elements.modal.querySelector('.modal__content') : null;
        this.elements.reviewsWrapper = document.getElementById('reviews-wrapper');
        this.elements.mapContainer = document.getElementById('map');
        this.elements.galleryGrid = document.querySelector('.gallery__grid');
        this.elements.lightbox = document.getElementById('gallery-lightbox');
        this.elements.lightboxImage = this.elements.lightbox ? this.elements.lightbox.querySelector('.lightbox__image') : null;
        this.elements.lightboxClose = this.elements.lightbox ? this.elements.lightbox.querySelector('.lightbox__close') : null;
        this.elements.lightboxOverlay = this.elements.lightbox ? this.elements.lightbox.querySelector('.lightbox__overlay') : null;
    },

    // --- Модуль: Мобильное меню ---
    initMobileMenu() {
        const { burger, navMenu } = this.elements;
        if (!burger || !navMenu) return;

        burger.addEventListener('click', () => {
            const isActive = burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            burger.setAttribute('aria-expanded', isActive);
        });

        navMenu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    },

    // --- Модуль: Услуги ---
    async initServices() {
        // ... (код без изменений)
        const { servicesGrid } = this.elements;
        if (!servicesGrid) return;

        try {
            const response = await fetch('services.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            this.data.services = await response.json();

            servicesGrid.innerHTML = '';
            this.data.services.forEach((service, index) => {
                const card = document.createElement('div');
                card.className = 'service-card fade-in';
                card.dataset.index = index;
                card.innerHTML = `
                    <h3 class="service-card__title">${service.title}</h3>
                    <p class="service-card__price">${service.price}</p>
                    <span class="service-card__details-btn">Подробнее</span>
                `;
                servicesGrid.appendChild(card);
            });

            this.observeDynamicElements();

        } catch (error) {
            console.error("Не удалось загрузить данные об услугах:", error);
            servicesGrid.innerHTML = '<p>Не удалось загрузить услуги. Попробуйте обновить страницу.</p>';
        }
    },

    // --- Модуль: Модальное окно (Услуги) ---
    initModalListeners() {
        // ... (код без изменений)
        const { servicesGrid, modal } = this.elements;
        if (!servicesGrid || !modal) return;

        servicesGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.service-card');
            if (card && card.dataset.index) {
                this.showServiceDetails(card.dataset.index);
            }
        });

        modal.addEventListener('click', (event) => {
            if (event.target.dataset.close) {
                this.closeModal();
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('open')) {
                this.closeModal();
            }
        });
    },

    showServiceDetails(serviceIndex) {
        // ... (код без изменений)
        const service = this.data.services[serviceIndex];
        const { modalContent } = this.elements;
        if (!service || !modalContent) return;

        const createList = (items) => items.map(item => `<li>${item}</li>`).join('');

        modalContent.innerHTML = `
            <button class="modal__close" data-close="true">&times;</button>
            <h2 class="modal-service__title">${service.title}</h2>
            <p class="modal-service__price">${service.price}</p>
            <p>${service.shortDescription}</p>
            <h3 class="modal-service__subtitle">В процедуру входит:</h3>
            <ul class="modal-service__list">${createList(service.includes)}</ul>
            <h3 class="modal-service__subtitle">Преимущества и эффекты:</h3>
            <ul class="modal-service__list">${createList(service.effects)}</ul>
            <h3 class="modal-service__subtitle">Особенности и рекомендации:</h3>
            <p class="modal-service__features">${service.features}</p>
            <p class="modal-service__final">${service.finalParagraph}</p>
            <a href="https://wa.me/79215232545?text=Здравствуйте, хочу записаться на услугу: ${encodeURIComponent(service.title)}" target="_blank" class="btn btn--primary" style="margin-top: 1.5rem; display: block;">Записаться</a>
        `;
        this.openModal();
    },

    openModal() {
        this.elements.modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        this.elements.modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    },

    // --- Модуль: Отзывы ---
    async initReviews() {
        // ... (код без изменений)
        const { reviewsWrapper } = this.elements;
        if (!reviewsWrapper) return;

        try {
            const response = await fetch('reviews.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const reviews = await response.json();

            reviewsWrapper.innerHTML = '';
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

            this.initReviewsSlider();

        } catch(error) {
            console.error("Не удалось загрузить отзывы:", error);
            reviewsWrapper.innerHTML = "<p>Не удалось загрузить отзывы.</p>";
        }
    },

    initReviewsSlider() {
        // ... (код без изменений)
        new Swiper('.reviews__slider', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
        });
    },

    // --- Модуль: Карта ---
    initMap() {
        // ... (код без изменений)
        const { mapContainer } = this.elements;
        if (!mapContainer || typeof ymaps === 'undefined') return;

        ymaps.ready(() => {
            const coords = [61.702171, 30.688579];
            const myMap = new ymaps.Map(mapContainer, { center: coords, zoom: 17, controls: ['zoomControl'] });
            const myPlacemark = new ymaps.Placemark(coords,
                { hintContent: 'Li-Студия массажного искусства', balloonContent: 'г. Сортавала, ул. Карельская, д. 11' },
                { iconLayout: 'default#image', iconImageHref: 'assets/images/map-pin.svg', iconImageSize: [50, 50], iconImageOffset: [-25, -50] }
            );
            myMap.geoObjects.add(myPlacemark);
            myMap.behaviors.disable('scrollZoom');
        });
    },

    // --- Модуль: Анимации при скролле ---
    initScrollAnimations() {
        // ... (код без изменений)
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.observeDynamicElements();
    },

    observeDynamicElements() {
        const animatedElements = document.querySelectorAll('.fade-in');
        animatedElements.forEach(el => this.observer.observe(el));
    },

    // --- НОВЫЙ МОДУЛЬ: Галерея и Лайтбокс ---
    initGalleryLightbox() {
        const { galleryGrid, lightbox, lightboxImage, lightboxClose, lightboxOverlay } = this.elements;
        if (!galleryGrid || !lightbox || !lightboxImage || !lightboxClose || !lightboxOverlay) return;

        galleryGrid.addEventListener('click', (event) => {
            const item = event.target.closest('.gallery__item');
            if (item) {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImage.src = img.src;
                    lightbox.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            }
        });

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = 'auto';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', closeLightbox);
    }
};

// --- Запуск приложения ---
App.init();
