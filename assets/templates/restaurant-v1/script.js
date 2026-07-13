const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 30);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (header && navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    document.body.classList.toggle('menu-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}
