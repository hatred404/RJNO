/**
 * RJNO Portfolio — Interactive UI
 *
 * Responsibilities:
 * - Mouse-follow spotlight
 * - Desktop section scrollspy
 * - Smooth anchor scrolling
 * - Clipboard buttons + toast feedback
 * - Contact form mailto handling
 * - Dynamic footer year
 */

document.addEventListener('DOMContentLoaded', initPortfolio);

function initPortfolio() {
  initSpotlight();
  initScrollspy();
  initSmoothScroll();
  initClipboardButtons();
  initContactForm();
  initCurrentYear();
}

/* --------------------------------------------------------------------------
   Shared helpers
   -------------------------------------------------------------------------- */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* --------------------------------------------------------------------------
   Mouse spotlight
   -------------------------------------------------------------------------- */

function initSpotlight() {
  const spotlight = $('#spotlight');
  if (!spotlight) return;

  const updatePosition = ({ clientX, clientY }) => {
    spotlight.style.setProperty('--mouse-x', `${clientX}px`);
    spotlight.style.setProperty('--mouse-y', `${clientY}px`);
    spotlight.style.opacity = '1';
  };

  window.addEventListener('mousemove', updatePosition, { passive: true });

  document.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    spotlight.style.opacity = '1';
  });
}

/* --------------------------------------------------------------------------
   Desktop section scrollspy
   -------------------------------------------------------------------------- */

function initScrollspy() {
  const navLinks = $$('.sidebar-nav .nav-link');
  const sections = $$('main section.content-section');

  if (!navLinks.length || !sections.length) return;

  const setActiveSection = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive = link.dataset.section === sectionId;

      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Handle the two edge cases IntersectionObserver can miss:
  // very top of page and absolute bottom of page.
  const updateScrollEdgeState = () => {
    const scrollY = window.scrollY;
    const viewportBottom = scrollY + window.innerHeight;
    const documentBottom = document.documentElement.scrollHeight;

    if (scrollY < 120) {
      setActiveSection(sections[0].id);
      return;
    }

    if (viewportBottom >= documentBottom - 60) {
      setActiveSection(sections.at(-1).id);
    }
  };

  window.addEventListener('scroll', updateScrollEdgeState, { passive: true });

  const initialHash = window.location.hash.slice(1);
  if (initialHash && document.getElementById(initialHash)) {
    setTimeout(() => setActiveSection(initialHash), 100);
  }
}

/* --------------------------------------------------------------------------
   Smooth scrolling
   -------------------------------------------------------------------------- */

function initSmoothScroll() {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href')?.slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      history.pushState(null, '', `#${targetId}`);
    });
  });
}

/* --------------------------------------------------------------------------
   Toast + clipboard
   -------------------------------------------------------------------------- */

function initClipboardButtons() {
  const buttons = $$('.copy-btn');
  const toast = $('#toast');
  const toastMessage = $('#toast-message');

  if (!buttons.length || !toast || !toastMessage) return;

  let toastTimer;

  const showToast = (message) => {
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      if (!text) return;

      try {
        await copyText(text);
        showToast(`Copied "${text}" to clipboard!`);
      } catch {
        showToast('Unable to copy. Please copy it manually.');
      }
    });
  });

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Legacy fallback for browsers without the Clipboard API.
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand('copy');
    textarea.remove();

    if (!copied) {
      throw new Error('Clipboard copy failed');
    }
  }

  return showToast;
}

/* --------------------------------------------------------------------------
   Contact form
   -------------------------------------------------------------------------- */

function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = $('#sender-name', form)?.value.trim();
    const email = $('#sender-email', form)?.value.trim();
    const message = $('#sender-message', form)?.value.trim();

    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hello Jake,\n\n${message}\n\nFrom: ${name} (${email})`
    );

    const mailto = `mailto:rjnoloya404@gmail.com?subject=${subject}&body=${body}`;

    // Reuse the existing toast UI if available.
    const toast = $('#toast');
    const toastMessage = $('#toast-message');

    if (toast && toastMessage) {
      toastMessage.textContent = 'Opening email client with your message...';
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
        window.location.href = mailto;
      }, 400);
    } else {
      window.location.href = mailto;
    }
  });
}

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */

function initCurrentYear() {
  const yearElement = $('#current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
