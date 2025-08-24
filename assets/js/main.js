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
        });
    },

    initMobileMenu() {
        // ... (logic for burger menu)
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
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2>${service.title}</h2>
                    <p>${service.price}</p>
                    <p>${service.shortDescription}</p>
                    <h4>В процедуру входит:</h4>
                    <ul>${service.includes.map(item => `<li>${item}</li>`).join('')}</ul>
                    <a href="https://wa.me/79215232545?text=Запись на: ${service.title}" class="btn btn--primary">Записаться</a>
                </div>
            </div>
        `;
        modalContainer.querySelector('.modal-overlay').addEventListener('click', e => {
            if (e.target.matches('.modal-overlay, .modal-close')) {
                modalContainer.innerHTML = '';
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
