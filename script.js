/* =========================================================
   Aravali International School — Main Script
   ========================================================= */

;(function () {
  'use strict';

  /* ---------- Utility helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Current year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll progress bar ---------- */
  const progress = $('.progress');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && progress) {
      progress.style.width = (scrollTop / docHeight) * 100 + '%';
    }
  }

  /* ---------- Header scroll state ---------- */
  const header = $('.header');

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /* ---------- Back-to-top button ---------- */
  const toTop = $('.to-top');

  function updateToTop() {
    if (!toTop) return;
    if (window.scrollY > 600) {
      toTop.classList.add('show');
    } else {
      toTop.classList.remove('show');
    }
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Active nav link ---------- */
  const sections = $$('section[id], .hero[id]');
  const navLinks = $$('.nav-links a:not(.btn)');

  function updateActiveNav() {
    let currentId = '';
    const offset = 150;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom > offset) {
        currentId = section.id;
      }
    }

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ---------- Combined scroll handler ---------- */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateProgress();
        updateHeader();
        updateToTop();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Initial call
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = $('.menu-toggle');
  const navOverlay = $('.nav-overlay');
  const navLinksContainer = $('#nav-links');

  function openMenu() {
    document.body.classList.add('menu-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const isOpen = document.body.classList.contains('menu-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close menu when a nav link is clicked
  if (navLinksContainer) {
    navLinksContainer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        closeMenu();
      }
    });
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = $(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const reveals = $$('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    reveals.forEach(function (el) {
      el.classList.add('in');
    });
  }

  /* ---------- Number counter animation ---------- */
  const counters = $$('[data-count]');

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current).toLocaleString('en-IN');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isDecimal) {
          el.textContent = target.toFixed(1);
        } else {
          el.textContent = target.toLocaleString('en-IN');
        }
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ---------- Form submission (Enquiry) ---------- */
  const enquiryForm = $('#enquiry-form');
  const toast = $('.toast');

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 5000);
  }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = enquiryForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Sending…</span>';

        // Simulate network request
        setTimeout(function () {
          btn.disabled = false;
          btn.innerHTML = originalHTML;
          enquiryForm.reset();
          showToast();
        }, 1500);
      }
    });
  }

  /* ---------- Newsletter form ---------- */
  const newsletterForm = $('#newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      newsletterForm.reset();
      showToast();
    });
  }

  /* ---------- Marquee pause on hover (already in CSS, but ensure touch) ---------- */
  const marquee = $('.marquee');

  if (marquee) {
    marquee.addEventListener('touchstart', function () {
      marquee.style.setProperty('--marquee-state', 'paused');
    }, { passive: true });
    marquee.addEventListener('touchend', function () {
      marquee.style.setProperty('--marquee-state', 'running');
    }, { passive: true });
  }

})();
