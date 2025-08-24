const App = {
    data: {
        services: [],
    },

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initMobileMenu();
            this.initStickyHeader();
            this.initServices();
            this.initReviews();
            this.initMap();
            this.initThemeSwitcher();
            this.initCertificates();
        });
    },

    initCertificates() {
        const container = document.getElementById('certificates-container');
        if (!container) return;
        const values = [500, 1000, 1500, 2000, 3000, 5000];
        container.innerHTML = values.map(value => `
            <div class="certificate-card">
                <h3>${value}₽</h3>
                <p>Подарочный сертификат</p>
                <a href="https://wa.me/79215232545?text=Хочу приобрести сертификат на ${value}₽" target="_blank" class="btn">Приобрести</a>
            </div>
        `).join('');
    },

    initThemeSwitcher() {
        const switcher = document.getElementById('theme-switcher');
        if (!switcher) return;

        const doc = document.documentElement;
        const currentTheme = localStorage.getItem('theme') || 'light';
        doc.setAttribute('data-theme', currentTheme);

        switcher.addEventListener('click', () => {
            const newTheme = doc.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            doc.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    },

    initMobileMenu() {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav');
        if (!burger || !nav) return;
        burger.addEventListener('click', () => {
            nav.classList.toggle('active'); // You'll need to add CSS for .nav.active
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
                    <h3>${service.title}</h3>
                    <p>${service.shortDescription}</p>
                    <p><strong>${service.price}</strong></p>
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
