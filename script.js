(function () {
  'use strict';

  function initScrollReveal() {
    var prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (prefersReduced) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
      }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lightboxImage = document.getElementById('lightbox-image');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var closeTargets = lightbox.querySelectorAll('[data-lightbox-close]');
    var triggers = document.querySelectorAll('[data-lightbox-trigger]');
    var lastFocused = null;
    var closeTimer = null;

    function openLightbox(imgSrc, imgAlt, caption) {
      lastFocused = document.activeElement;
      lightboxImage.src = imgSrc;
      lightboxImage.alt = imgAlt;
      lightboxCaption.textContent = caption;

      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');

      requestAnimationFrame(function () {
        lightbox.classList.add('is-open');
      });

      var closeBtn = lightbox.querySelector('.lightbox-close');
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      if (!lightbox.classList.contains('is-open')) return;

      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');

      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        lightbox.hidden = true;
        lightboxImage.removeAttribute('src');
        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus();
        }
        lastFocused = null;
      }, 350);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var img = trigger.querySelector('img');
        var label = trigger.querySelector('.deliverable-label');
        if (!img) return;
        openLightbox(
          img.currentSrc || img.src,
          img.alt,
          label ? label.textContent : img.alt
        );
      });
    });

    closeTargets.forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });

    var panel = lightbox.querySelector('.lightbox-panel');
    if (panel) {
      panel.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        e.preventDefault();
        closeLightbox();
      }
    });
  }

  function init() {
    initScrollReveal();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
