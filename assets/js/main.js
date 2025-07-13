// Открытие модального окна по индексу
function openModal(idx) {
  document.getElementById('modal-' + idx).classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

// Закрытие модального окна по индексу
function closeModal(idx) {
  document.getElementById('modal-' + idx).classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

// Закрытие по overlay и Esc
document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < 13; i++) {
    const modal = document.getElementById('modal-' + i);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(i);
      });
    }
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      for (let i = 0; i < 13; i++) closeModal(i);
    }
  });

  // Мобильное меню
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      burger.classList.toggle('open');
      document.body.classList.toggle('overflow-hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        burger.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }
});
