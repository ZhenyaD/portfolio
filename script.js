(function () {
  'use strict';

  function sendPrompt(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showToast).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast();
    } catch (err) {
      showToast('Copy this prompt: ' + text);
    }
    document.body.removeChild(textarea);
  }

  var toastEl;
  var toastTimer;

  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent =
      message || 'Prompt copied — paste it into Claude to learn more about me.';
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 3200);
  }

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

  window.sendPrompt = sendPrompt;

  function initAskClaudeButton() {
    var btn = document.getElementById('ask-claude-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        sendPrompt('Tell me more about Evgenii as a PM');
      });
    }
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
    initAskClaudeButton();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
