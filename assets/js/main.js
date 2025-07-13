// Открытие/закрытие мобильного меню
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.querySelector('header button');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      menuOpen = !menuOpen;
      if (menuOpen) {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        // Анимация бургера в крестик
        burger.children[0].classList.add('rotate-45', 'translate-y-2');
        burger.children[1].classList.add('opacity-0');
        burger.children[2].classList.add('-rotate-45', '-translate-y-2');
      } else {
        mobileMenu.classList.add('translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        // Возврат бургера
        burger.children[0].classList.remove('rotate-45', 'translate-y-2');
        burger.children[1].classList.remove('opacity-0');
        burger.children[2].classList.remove('-rotate-45', '-translate-y-2');
      }
    });

    // Закрытие меню по клику на ссылку
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.add('translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        burger.children[0].classList.remove('rotate-45', 'translate-y-2');
        burger.children[1].classList.remove('opacity-0');
        burger.children[2].classList.remove('-rotate-45', '-translate-y-2');
      });
    });
  }

  // Модальное окно для услуг
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.dataset.title;
      modalPrice.textContent = card.dataset.price;
      modalDesc.textContent = card.dataset.desc;
      modal.classList.remove('hidden');
      gsap.fromTo(modal.querySelector('.modal-inner'), 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    gsap.to(modal.querySelector('.modal-inner'), {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => modal.classList.add('hidden')
    });
  }
});
