// Digital Oasis - Main Script

function initPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderLogo = preloader.querySelector('img');

    if (!preloader || !preloaderLogo) {
        return null;
    }

    const tl = gsap.timeline();
    tl.to(preloaderLogo, {
        opacity: 1,
        duration: 1.5,
        ease: "power1.inOut"
    }).to(preloaderLogo, {
        scale: 1.05,
        duration: 1,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut"
    }, "-=0.5");

    tl.to(preloader, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
            preloader.style.display = 'none';
        }
    }, "+=0.5");

    return tl; // Return the timeline instance
}

function initLogoCompass() {
    const logo = document.getElementById('logo-compass');
    const sections = document.querySelectorAll('main section');

    if (!logo || !sections.length) {
        return;
    }

    const rotations = [0, 45, 90, 135, 180];

    function updateLogoRotation() {
        let closestSectionIndex = 0;
        let minDistance = Infinity;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);

            if (distance < minDistance) {
                minDistance = distance;
                closestSectionIndex = index;
            }
        });

        const rotationAngle = rotations[closestSectionIndex % rotations.length];

        gsap.to(logo, {
            rotation: rotationAngle,
            duration: 0.8,
            ease: "cubic.out"
        });
    }

    let isThrottled = false;
    window.addEventListener('scroll', () => {
        if (!isThrottled) {
            window.requestAnimationFrame(() => {
                updateLogoRotation();
                isThrottled = false;
            });
            isThrottled = true;
        }
    });

    updateLogoRotation();
}


async function initServices() {
    const servicesSection = document.getElementById('services');
    if (!servicesSection) return;

    try {
        const response = await fetch('services.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const services = await response.json();

        const servicesContainer = document.createElement('div');
        servicesContainer.className = 'services-accordion';

        services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `
                <div class="service-header">
                    <div class="service-pattern">
                        <!-- Animated SVG will go here -->
                    </div>
                    <h3 class="service-title">${service.title}</h3>
                    <span class="service-price">${service.price}</span>
                </div>
                <div class="service-content">
                    <div class="service-content-inner">
                        <p>${service.shortDescription}</p>
                        <h4>В процедуру входит:</h4>
                        <ul>${service.includes.map(item => `<li>${item}</li>`).join('')}</ul>
                    </div>
                </div>
            `;
            servicesContainer.appendChild(serviceItem);
        });

        const heading = servicesSection.querySelector('h2');
        if(heading) {
            heading.insertAdjacentElement('afterend', servicesContainer);
        } else {
            servicesSection.appendChild(servicesContainer);
        }

        servicesContainer.addEventListener('click', (event) => {
            const header = event.target.closest('.service-header');
            if (!header) return;

            const currentItem = header.parentElement;
            const wasOpen = currentItem.classList.contains('is-open');

            servicesContainer.querySelectorAll('.service-item').forEach(item => {
                item.classList.remove('is-open');
            });

            if (!wasOpen) {
                currentItem.classList.add('is-open');
            }
        });

    } catch (error) {
        console.error("Could not load services:", error);
        servicesSection.innerHTML += '<p>Не удалось загрузить услуги.</p>';
    }
}


function initThemeSwitcher() {
    const switcher = document.getElementById('theme-switcher');
    const doc = document.documentElement;

    if (!switcher) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    doc.setAttribute('data-theme', currentTheme);

    switcher.addEventListener('click', () => {
        const newTheme = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        doc.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const preloaderTimeline = initPreloader();
    initThemeSwitcher();

    // ***FIX***: Chain content initialization to the end of the preloader animation
    if (preloaderTimeline) {
        preloaderTimeline.eventCallback("onComplete", () => {
            initLogoCompass();
            initServices();
        });
    } else {
        // If no preloader, init immediately
        initLogoCompass();
        initServices();
    }
});
