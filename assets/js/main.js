/**
 * @file Главный скрипт для сайта Li-Студия.
 * @version 3.0.0
 */

const App = {
    data: {
        services: [], // Cache for service data
    },

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initMobileMenu();
            this.initServices();
            this.initMap();
        });
    },

    initMap() {
        const mapContainer = document.getElementById('map');
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

    initMobileMenu() {
        const burger = document.querySelector('.burger');
        const navMenu = document.querySelector('.nav');
        if (!burger || !navMenu) return;

        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navMenu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    },

    async initServices() {
        const container = document.getElementById('services-container');
        if (!container) return;

        try {
            const response = await fetch('services.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            this.data.services = await response.json();

            container.innerHTML = ''; // Clear skeleton
            this.data.services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.dataset.id = service.id; // Set data-id for modal

                card.innerHTML = `
                    <h3 class="service-card__title">${service.title}</h3>
                    <p class="service-card__desc">${service.shortDescription}</p>
                    <p class="service-card__price">${service.price}</p>
                `;
                container.appendChild(card);
            });

            // Add click listener for the modal
            container.addEventListener('click', (e) => {
                const card = e.target.closest('.service-card');
                if (card && card.dataset.id) {
                    this.showModal(card.dataset.id);
                }
            });

        } catch (error) {
            console.error("Не удалось загрузить данные об услугах:", error);
            container.innerHTML = '<p>Не удалось загрузить услуги. Попробуйте обновить страницу.</p>';
        }
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
                    <h3 class="modal-service-subtitle">Преимущества и эффекты:</h3>
                    <ul class="modal-service-list">${service.effects.map(item => `<li>${item}</li>`).join('')}</ul>
                    <p><strong>Особенности:</strong> ${service.features}</p>
                </div>
            </div>
        `;

        modalContainer.innerHTML = modalHTML;
        const overlay = modalContainer.querySelector('.modal-overlay');

        // Use a short timeout to allow the element to be in the DOM before adding the class
        setTimeout(() => {
            overlay.classList.add('is-visible');
            document.body.classList.add('no-scroll');
        }, 10);

        // Add listeners to close the modal
        overlay.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        });
    },

    closeModal() {
        const modalContainer = document.getElementById('modal-container');
        const overlay = modalContainer.querySelector('.modal-overlay');
        if (!overlay) return;

        overlay.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');

        // Remove the modal from the DOM after the transition ends
        setTimeout(() => {
            modalContainer.innerHTML = '';
        }, 300); // Should match the CSS transition duration
    }
};

App.init();
