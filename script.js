(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  const navLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');

  const closeMenu = () => {
    header?.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
  };

  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 10);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const isOpen = header?.classList.toggle('menu-open') ?? false;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', event => {
    if (!header?.classList.contains('menu-open')) return;
    if (event.target instanceof Node && !header.contains(event.target)) closeMenu();
  });

  document.querySelectorAll('.accordion-item > button').forEach(button => {
    button.addEventListener('click', () => {
      const currentItem = button.closest('.accordion-item');
      if (!currentItem) return;

      const shouldOpen = !currentItem.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem === currentItem) return;
        openItem.classList.remove('open');
        openItem.querySelector(':scope > button')?.setAttribute('aria-expanded', 'false');
      });

      currentItem.classList.toggle('open', shouldOpen);
      button.setAttribute('aria-expanded', String(shouldOpen));
    });
  });

  const detailsToggle = document.querySelector('.details-toggle');
  const planDetails = document.getElementById('plan-details');

  detailsToggle?.addEventListener('click', () => {
    const isOpen = detailsToggle.getAttribute('aria-expanded') !== 'true';
    detailsToggle.setAttribute('aria-expanded', String(isOpen));

    if (planDetails) planDetails.hidden = !isOpen;

    const label = detailsToggle.querySelector('span');
    if (label) label.textContent = isOpen ? 'Hide full plan details' : 'Compare full plan details';
  });

  const revealElements = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('visible'));
  }

  const sectionIds = [...navLinks]
    .map(link => link.getAttribute('href'))
    .filter(href => href && href.length > 1)
    .map(href => href.slice(1));

  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.01, 0.2, 0.5] });

    sections.forEach(section => navObserver.observe(section));
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
