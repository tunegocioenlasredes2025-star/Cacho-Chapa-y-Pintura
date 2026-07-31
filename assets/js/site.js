/* ==========================================================================
   TALLER CACHO — Interacciones
   Vanilla JS, sin dependencias. Todo degrada bien si algo falla.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Header: fondo sólido al scrollear + link activo por sección
     ------------------------------------------------------------------------ */
  var header = $('#header');
  var progress = $('#progress');
  var toTop = $('#toTop');
  var navLinks = $$('.nav a');
  var lastY = -1;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y === lastY) { ticking = false; return; }
    lastY = y;

    if (header) header.classList.toggle('is-stuck', y > 60);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? y / max : 0;
      progress.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
      progress.classList.toggle('is-visible', y > 60);
    }

    ticking = false;
  }

  function requestScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }

  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });
  onScroll();

  /* Link activo — IntersectionObserver sobre las secciones con id */
  if ('IntersectionObserver' in window && navLinks.length) {
    var sections = navLinks
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ------------------------------------------------------------------------
     2. Menú móvil
     ------------------------------------------------------------------------ */
  var burger = $('#burger');
  var menu = $('#menu');

  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('is-locked', open);

    // Entrada escalonada de los links
    $$('.menu__nav a', menu).forEach(function (a, i) {
      a.style.transitionDelay = open ? (60 + i * 45) + 'ms' : '0ms';
    });
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ------------------------------------------------------------------------
     3. Reveal on scroll + contadores
     ------------------------------------------------------------------------
     IntersectionObserver es el camino principal, pero se complementa con un
     chequeo por scroll: hay contextos (webviews, pestañas en segundo plano)
     donde el observer no dispara y la sección quedaría invisible.
     ------------------------------------------------------------------------ */
  var revealables = $$('[data-reveal], .reveal-media, .process__step');
  var counters = $$('[data-count]');

  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';

    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }

    var duration = 1500;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function inViewport(el, ratio) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.bottom <= 0 || r.top >= vh) return false;
    var visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    return r.height === 0 ? true : visible / r.height >= ratio;
  }

  var sweepTimer = null;

  function doSweep() {
    sweepTimer = null;
    revealables = revealables.filter(function (el) {
      if (!inViewport(el, 0.05)) return true;
      el.classList.add('is-visible');
      return false;
    });
    counters = counters.filter(function (el) {
      if (!inViewport(el, 0.5)) return true;
      runCounter(el);
      return false;
    });
    if (!revealables.length && !counters.length) {
      window.removeEventListener('scroll', sweep);
      window.removeEventListener('resize', sweep);
      if (sweepTimer !== null) { window.clearTimeout(sweepTimer); sweepTimer = null; }
    }
  }

  /* Throttle por tiempo, no por rAF: en una pestaña en segundo plano rAF no
     corre y el fallback dejaría de existir justo cuando más hace falta. */
  function sweep() {
    if (sweepTimer !== null) return;
    sweepTimer = window.setTimeout(doSweep, 90);
  }

  if (reduceMotion) {
    $$('[data-reveal], .reveal-media, .process__step').forEach(function (el) {
      el.classList.add('is-visible');
    });
    revealables = [];
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('resize', sweep, { passive: true });
  window.addEventListener('load', sweep);
  doSweep();

  /* ------------------------------------------------------------------------
     5. Parallax muy leve del hero
     ------------------------------------------------------------------------ */
  var heroMedia = $('#heroMedia');
  if (heroMedia && !reduceMotion && window.matchMedia('(min-width: 760px)').matches) {
    var heroTicking = false;
    var applyParallax = function () {
      var y = window.scrollY || window.pageYOffset;
      if (y < window.innerHeight * 1.2) {
        heroMedia.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(2) + 'px,0)';
      }
      heroTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!heroTicking) { heroTicking = true; window.requestAnimationFrame(applyParallax); }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     6. FAQ (acordeón accesible)
     ------------------------------------------------------------------------ */
  $$('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var open = item.classList.contains('is-open');

      // Cierra el resto: mantiene la lista corta y ordenada
      $$('.faq__item.is-open').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        var b = $('.faq__q', other);
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ------------------------------------------------------------------------
     7. Galería + lightbox
     ------------------------------------------------------------------------ */
  var lightbox = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var items = $$('#gallery .gallery__item');
  var current = 0;
  var lastFocused = null;

  function showImage(i) {
    if (!items.length) return;
    current = (i + items.length) % items.length;
    var item = items[current];
    var img = $('img', item);
    lbImg.src = item.getAttribute('href');
    lbImg.alt = img ? img.alt : '';
    lbCap.textContent = item.getAttribute('data-cap') || '';
  }

  function openLightbox(i) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    showImage(i);
    lightbox.classList.add('is-open');
    document.body.classList.add('is-locked');
    $('#lbClose').focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (lastFocused) lastFocused.focus();
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(i);
    });
  });

  if (lightbox) {
    $('#lbClose').addEventListener('click', closeLightbox);
    $('#lbPrev').addEventListener('click', function () { showImage(current - 1); });
    $('#lbNext').addEventListener('click', function () { showImage(current + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(current - 1);
      if (e.key === 'ArrowRight') showImage(current + 1);
      if (e.key === 'Tab') {
        // Mantiene el foco dentro del diálogo
        var focusables = $$('button', lightbox);
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Swipe en mobile
    var touchX = null;
    lightbox.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 55) showImage(current + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }

  /* Cierra el menú móvil con Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) setMenu(false);
  });

  /* ------------------------------------------------------------------------
     8. Varios
     ------------------------------------------------------------------------ */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
