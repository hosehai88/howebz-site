(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  mobileLinks.forEach(link => link.addEventListener('click', () => {
    header?.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
  }));

  document.addEventListener('click', event => {
    if (header?.classList.contains('menu-open') && !header.contains(event.target)) {
      header.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Open menu');
    }
  });

  document.querySelectorAll('.accordion-item > button, .mobile-plan-detail > button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item, .mobile-plan-detail');
      if (!item) return;
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.querySelectorAll('.caption-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const more = button.parentElement?.querySelector('.caption-more');
      if (!more) return;
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      more.hidden = !open;
      button.firstChild.textContent = open ? 'Hide full caption ' : 'View full caption ';
    });
  });

  const compareToggle = document.querySelector('.compare-toggle');
  const comparePanel = document.getElementById('compare-panel');
  compareToggle?.addEventListener('click', () => {
    const open = compareToggle.getAttribute('aria-expanded') !== 'true';
    compareToggle.setAttribute('aria-expanded', String(open));
    comparePanel.hidden = !open;
    const label = compareToggle.querySelector('span');
    if (label) label.textContent = open ? 'Hide Plan Details' : 'See Everything Included';
    if (open) requestAnimationFrame(() => comparePanel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });

  const tooltip = document.querySelector('.tooltip');
  let activeTooltipButton = null;

  const positionTooltip = button => {
    if (!tooltip || !button) return;
    const rect = button.getBoundingClientRect();
    const padding = 12;
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.hidden = false;
    const tipRect = tooltip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(padding, Math.min(left, window.innerWidth - tipRect.width - padding));
    let top = rect.bottom + 8;
    if (top + tipRect.height > window.innerHeight - padding) top = rect.top - tipRect.height - 8;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(padding, top)}px`;
  };

  const showTooltip = button => {
    if (!tooltip || !button) return;
    activeTooltipButton = button;
    tooltip.textContent = button.dataset.tooltip || '';
    positionTooltip(button);
  };

  const hideTooltip = () => {
    if (!tooltip) return;
    tooltip.hidden = true;
    tooltip.textContent = '';
    activeTooltipButton = null;
  };

  document.querySelectorAll('.info-button').forEach(button => {
    button.addEventListener('mouseenter', () => showTooltip(button));
    button.addEventListener('mouseleave', hideTooltip);
    button.addEventListener('focus', () => showTooltip(button));
    button.addEventListener('blur', hideTooltip);
    button.addEventListener('click', event => {
      event.stopPropagation();
      if (activeTooltipButton === button && !tooltip.hidden) hideTooltip();
      else showTooltip(button);
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.info-button')) hideTooltip();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      hideTooltip();
      header?.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  });
  window.addEventListener('resize', () => activeTooltipButton ? positionTooltip(activeTooltipButton) : null);
  window.addEventListener('scroll', hideTooltip, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(element => observer.observe(element));
  } else {
    reveals.forEach(element => element.classList.add('visible'));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
