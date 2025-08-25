const App = {
    data: {
        services: [],
    },

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initMobileMenu();
            this.initStickyHeader();
            this.initServices().then(() => {
                this.initServiceCardParallax();
            });
            this.initReviews();
            this.initMap();
        });
    },

    initServiceCardParallax() {
        const cards = document.querySelectorAll('.service-card');
        if (!cards.length) return;

        window.addEventListener('scroll', () => {
            for (const card of cards) {
                const rect = card.getBoundingClientRect();
                const bg = card.querySelector('.service-card__bg');

                // Is the card in the viewport?
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    const scrollPercent = (rect.top + rect.height) / (window.innerHeight + rect.height);
                    const yPos = (scrollPercent - 0.5) * 40; // Adjust 40 for more/less effect
                    bg.style.transform = `translateY(${yPos}px)`;
                }
            }
        });
    },

    initMobileMenu() {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav');
        if (!burger || !nav) return;
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    },

    initStickyHeader() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    },

    async initServices() {
        const container = document.getElementById('services-container');
        if (!container) return;
        try {
            const response = await fetch('services.json');
            this.data.services = await response.json();
            container.innerHTML = this.data.services.map(service => `
                <div class="service-card" data-id="${service.id}">
                    <div class="service-card__bg"></div>
                    <div class="service-card__content">
                        <h3>${service.title}</h3>
                        <p>${service.shortDescription}</p>
                        <p><strong>${service.price}</strong></p>
                        <span class="service-card__details">Подробнее</span>
                    </div>
                </div>
            `).join('');
            container.addEventListener('click', e => {
                const card = e.target.closest('.service-card');
                if (card) this.showModal(card.dataset.id);
            });
        } catch (error) { console.error("Failed to load services:", error); }
    },

    async initReviews() {
        const container = document.getElementById('reviews-container');
        if (!container) return;
        try {
            const response = await fetch('reviews.json');
            const reviews = await response.json();
            container.innerHTML = reviews.map(review => `
                <div class="review-card">
                    <p>"${review.text}"</p>
                    <p><strong>- ${review.author}</strong></p>
                </div>
            `).join('');
        } catch (error) { console.error("Failed to load reviews:", error); }
    },

    showModal(serviceId) {
        const service = this.data.services.find(s => s.id === serviceId);
        if (!service) return;
        const modalContainer = document.getElementById('modal-container');
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2 class="modal-service-title">${service.title}</h2>
                    <p class="modal-service-price">${service.price}</p>
                    <p>${service.shortDescription}</p>
                    <h3 class="modal-service-subtitle">В процедуру входит:</h3>
                    <ul class="modal-service-list">${service.includes.map(item => `<li>${item}</li>`).join('')}</ul>
                    <a href="https://wa.me/79215232545?text=Запись на: ${service.title}" target="_blank" class="btn btn--primary" style="margin-top: 1.5rem;">Записаться</a>
                </div>
            </div>
        `;
        modalContainer.innerHTML = modalHTML;

        const overlay = modalContainer.querySelector('.modal-overlay');
        setTimeout(() => overlay.classList.add('is-visible'), 10);

        overlay.addEventListener('click', e => {
            if (e.target.matches('.modal-overlay, .modal-close')) {
                overlay.classList.remove('is-visible');
                setTimeout(() => modalContainer.innerHTML = '', 300);
            }
        });
    },

    initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer || typeof ymaps === 'undefined') return;
        ymaps.ready(() => {
            const myMap = new ymaps.Map(mapContainer, { center: [61.702171, 30.688579], zoom: 17 });
            myMap.geoObjects.add(new ymaps.Placemark([61.702171, 30.688579]));
        });
    }
};

App.init();
