(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  const closeMenu = () => {
    header?.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
  };

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const isOpen = header?.classList.toggle('menu-open') ?? false;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (header?.classList.contains('menu-open') && !header.contains(event.target)) closeMenu();
  });

  document.querySelectorAll('.accordion-item > button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      if (!item) return;
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });

  const detailsToggle = document.querySelector('.details-toggle');
  const planDetails = document.getElementById('plan-details');
  detailsToggle?.addEventListener('click', () => {
    const isOpen = detailsToggle.getAttribute('aria-expanded') !== 'true';
    detailsToggle.setAttribute('aria-expanded', String(isOpen));
    if (planDetails) planDetails.hidden = !isOpen;
    const label = detailsToggle.querySelector('span');
    if (label) label.textContent = isOpen ? 'Hide full plan details' : 'See full plan details';
  });

  const revealElements = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('visible'));
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
