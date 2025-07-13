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

  // Аккордеон для услуг
  document.querySelectorAll('.service-toggle').forEach((btn) => {
    btn.addEventListener('click', function () {
      const card = btn.closest('.service-card');
      const content = card.querySelector('.service-content');
      const icon = card.querySelector('.service-icon svg');
      const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

      // Закрыть все остальные
      document.querySelectorAll('.service-content').forEach((el) => {
        if (el !== content) {
          el.style.maxHeight = null;
          const otherIcon = el.parentElement.querySelector('.service-icon svg');
          if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
        }
      });

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.style.transform = "rotate(45deg)";
      } else {
        content.style.maxHeight = null;
        if (icon) icon.style.transform = "rotate(0deg)";
      }
    });
  });
});
