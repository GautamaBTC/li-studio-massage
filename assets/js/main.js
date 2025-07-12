// Открытие/закрытие мобильного меню
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.querySelector('header button');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

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
});
