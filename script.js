(() => {
  "use strict";

  const REGISTER_URL = "/register";
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const toast = document.querySelector("[data-toast]");
  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  const pageSections = [...document.querySelectorAll("main section[id]")];
  let toastTimer;

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function readSelectedTemplate() {
    try {
      return localStorage.getItem("howebz-selected-template") || "";
    } catch (_) {
      return "";
    }
  }

  function saveSelection(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      // Registration still works when browser storage is blocked.
    }
  }

  function createRegisterUrl(plan = "") {
    const params = new URLSearchParams();
    const selectedTemplate = readSelectedTemplate();
    if (plan) params.set("plan", slugify(plan));
    if (selectedTemplate) params.set("template", slugify(selectedTemplate));
    const query = params.toString();
    return query ? `${REGISTER_URL}?${query}` : REGISTER_URL;
  }

  function closeMobileMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  function toggleMobileMenu() {
    if (!menuButton || !mobileMenu) return;
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    mobileMenu.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  }

  function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 18);
    backToTop?.classList.toggle("visible", window.scrollY > 700);
  }

  function updateActiveNavigation() {
    if (!pageSections.length) return;
    const offset = window.scrollY + 150;
    let currentId = pageSections[0].id;

    pageSections.forEach((section) => {
      if (section.offsetTop <= offset) currentId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  }

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function setupRevealAnimations() {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px" });

    elements.forEach((element) => observer.observe(element));
  }

  function configurePlanLinks() {
    document.querySelectorAll(".plan-button").forEach((link) => {
      const plan = link.dataset.plan || "";
      link.href = createRegisterUrl(plan);
      link.addEventListener("click", () => saveSelection("howebz-selected-plan", plan));
    });
  }

  menuButton?.addEventListener("click", toggleMobileMenu);
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("scroll", () => {
    updateHeader();
    updateActiveNavigation();
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMobileMenu();
  });

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));


  document.querySelectorAll("[data-template]").forEach((button) => {
    button.addEventListener("click", () => {
      const templateName = button.dataset.template || "Website Template";
      saveSelection("howebz-selected-template", templateName);
      showToast(`${templateName} selected. Choose a plan to continue.`);
      configurePlanLinks();
      document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelector("[data-view-all]")?.addEventListener("click", () => {
    showToast("More templates are coming soon.");
  });

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".footer-social a[href='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Add the official social media URL in index.html.");
    });
  });

  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  configurePlanLinks();
  setupRevealAnimations();
  updateHeader();
  updateActiveNavigation();
})();
