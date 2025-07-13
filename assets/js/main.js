// Открытие/закрытие мобильного меню
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu-overlay');

burger.addEventListener('click', () => {
  mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
  mobileMenu.hidden = !mobileMenu.hidden;
});

// Закрытие меню по клику вне меню или по ссылке
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu || e.target.tagName === 'A') {
    mobileMenu.style.display = 'none';
    mobileMenu.hidden = true;
  }
});
