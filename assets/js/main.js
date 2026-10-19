/**
 * Restaurant BOBY — SPA Router & Architecture web-craft
 * Routage par hash ultra-fluide (/#carte, /#histoire, /#galerie, /#reservation)
 * Compatible Hostinger / Apache / Vercel
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 1. NETTOYEUR D'URL CLIENT (Supprime index.html propre)
  // ─────────────────────────────────────────────────────────────
  if (window.location.pathname.endsWith('index.html')) {
    const clean = window.location.pathname.replace(/index\.html$/, '');
    window.history.replaceState(null, '', clean + (window.location.hash || ''));
  }

  // ─────────────────────────────────────────────────────────────
  // 2. CONFIGURATION DES ROUTES SPA
  // ─────────────────────────────────────────────────────────────
  const routes = {
    '': {
      page: 'page-accueil',
      title: "Restaurant BOBY — Bistronomie en Provence par Alexandre Spinelli | La Londe-les-Maures"
    },
    'accueil': {
      page: 'page-accueil',
      title: "Restaurant BOBY — Bistronomie en Provence par Alexandre Spinelli | La Londe-les-Maures"
    },
    'carte': {
      page: 'page-carte',
      title: "La Carte & Menus — Restaurant BOBY | La Londe-les-Maures"
    },
    'menu': {
      page: 'page-carte',
      title: "La Carte & Menus — Restaurant BOBY | La Londe-les-Maures"
    },
    'histoire': {
      page: 'page-histoire',
      title: "Le Chef Alexandre Spinelli & La Maison — Restaurant BOBY"
    },
    'chef': {
      page: 'page-histoire',
      title: "Le Chef Alexandre Spinelli & La Maison — Restaurant BOBY"
    },
    'le-chef': {
      page: 'page-histoire',
      title: "Le Chef Alexandre Spinelli & La Maison — Restaurant BOBY"
    },
    'galerie': {
      page: 'page-galerie',
      title: "Galerie Photographique — Restaurant BOBY | Plats, Salle & Terrasse"
    },
    'reservation': {
      page: 'page-reservation',
      title: "Réserver une table — Restaurant BOBY | 04 83 69 08 49"
    }
  };

  function closeMobileDrawer() {
    const burger = document.getElementById('burger-btn');
    const menu = document.getElementById('mobile-menu');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (menu) menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPage(hash) {
    const cleanHash = (hash || '').replace(/^#\/?/, '').toLowerCase();
    const route = routes[cleanHash] || routes[''];

    // Basculer les pages SPA
    document.querySelectorAll('.spa-page').forEach(page => {
      page.classList.remove('active');
    });

    const targetEl = document.getElementById(route.page);
    if (targetEl) {
      targetEl.classList.add('active');
    }

    // Mettre à jour document.title
    document.title = route.title;

    // Mettre à jour les liens actifs dans la navigation
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkHash = href.replace(/^#\/?/, '').toLowerCase();

      const isCurrent = (cleanHash === '' && (linkHash === '' || linkHash === '#' || linkHash === 'accueil')) ||
                        (cleanHash !== '' && (linkHash === cleanHash || (cleanHash === 'chef' && linkHash === 'histoire') || (cleanHash === 'histoire' && linkHash === 'chef')));

      if (isCurrent) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });

    // Remonter en haut de page instantanément sans saccade
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // ─────────────────────────────────────────────────────────────
  // 3. ÉCOUTEURS DE NAVIGATION SPA
  // ─────────────────────────────────────────────────────────────
  function initRouting() {
    // Interception des clics Accueil (retour à l'URL propre / sans #)
    document.querySelectorAll('a[href="#"], #nav-accueil, .site-header .header-logo').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.location.hash) {
          window.history.pushState(null, '', window.location.pathname);
        }
        showPage('');
        closeMobileDrawer();
      });
    });

    // Interception des ancres SPA (#carte, #histoire, etc.)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      const hash = a.getAttribute('href');
      if (hash === '#' || hash === '') return;

      a.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = hash;
        showPage(hash);
        closeMobileDrawer();
      });
    });

    // Écouteurs hashchange et popstate
    window.addEventListener('hashchange', () => {
      showPage(window.location.hash);
    });

    window.addEventListener('popstate', () => {
      showPage(window.location.hash);
    });

    // Initialisation au chargement
    showPage(window.location.hash);
  }

  // ─────────────────────────────────────────────────────────────
  // 4. HEADER SCROLL DETECTION
  // ─────────────────────────────────────────────────────────────
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll();
  }

  // ─────────────────────────────────────────────────────────────
  // 5. MENU MOBILE ACCESSIBLE
  // ─────────────────────────────────────────────────────────────
  function initMobileMenu() {
    const burger = document.getElementById('burger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileDrawer();
      } else {
        burger.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        closeMobileDrawer();
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 6. CURSEUR SUR-MESURE DISCRET (POINTEUR SYSTÈME PRÉSERVÉ)
  // ─────────────────────────────────────────────────────────────
  function initCustomCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);
    }

    let cx = -100, cy = -100;
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!ticking) {
        requestAnimationFrame(() => {
          cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    const hoverTarget = 'a, button, input, select, textarea, label, .galerie-item, .nav-page-card, .plat-item';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTarget)) {
        cursor.classList.add('is-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTarget)) {
        cursor.classList.remove('is-hover');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 7. FORMULAIRE DE RÉSERVATION (VALIDATION MERCREDI/JEUDI FERMÉ)
  // ─────────────────────────────────────────────────────────────
  function initReservation() {
    const form = document.getElementById('resa-form');
    if (!form) return;

    const dateInput = document.getElementById('resa-date');
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    function checkDateValidity(val) {
      if (!val) return { ok: false, msg: 'Veuillez sélectionner une date.' };
      const d = new Date(val + 'T12:00:00');
      const day = d.getDay(); // 3 = mercredi, 4 = jeudi
      if (day === 3 || day === 4) {
        return {
          ok: false,
          msg: 'Le restaurant est fermé le mercredi et le jeudi. Merci de choisir un autre jour.'
        };
      }
      return { ok: true };
    }

    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-error');
        const err = input.parentElement.querySelector('.form-error');
        if (err) err.textContent = '';
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const nom = document.getElementById('resa-nom');
      const tel = document.getElementById('resa-tel');
      const date = document.getElementById('resa-date');
      const heure = document.getElementById('resa-heure');
      const couverts = document.getElementById('resa-couverts');
      const btn = form.querySelector('.btn-submit');

      function setError(input, msg) {
        if (!input) return;
        input.classList.add('is-error');
        const err = input.parentElement.querySelector('.form-error');
        if (err) err.textContent = msg;
        if (!hasError) {
          input.focus();
          hasError = true;
        }
      }

      if (!nom || !nom.value.trim()) setError(nom, 'Nom et prénom requis.');
      if (!tel || !tel.value.trim()) {
        setError(tel, 'Numéro de téléphone requis.');
      } else if (!/^[0-9+().\s-]{8,20}$/.test(tel.value.trim())) {
        setError(tel, 'Format de téléphone invalide.');
      }

      const email = document.getElementById('resa-email');
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError(email, 'Adresse e-mail invalide.');
      }

      if (date) {
        const check = checkDateValidity(date.value);
        if (!check.ok) setError(date, check.msg);
      }
      if (!heure || !heure.value) setError(heure, 'Sélectionnez un horaire.');
      if (!couverts || !couverts.value) setError(couverts, 'Indiquez le nombre de couverts.');

      if (hasError) return;

      if (btn) {
        btn.classList.add('is-loading');
        btn.disabled = true;
        btn.textContent = 'Enregistrement en cours...';
      }

      setTimeout(() => {
        if (btn) {
          btn.classList.remove('is-loading');
          btn.classList.add('is-success');
          btn.textContent = 'Demande confirmée ✓';
        }

        const successBox = document.createElement('div');
        successBox.className = 'resa-confirmation-box';
        function escapeHTML(str) {
          const div = document.createElement('div');
          div.textContent = str || '';
          return div.innerHTML;
        }

        const safeNom = escapeHTML(nom.value.trim());
        const safeTel = escapeHTML(tel.value.trim());
        const safeCouverts = escapeHTML(couverts.value);
        const safeDate = escapeHTML(date.value);
        const safeHeure = escapeHTML(heure.value);

        successBox.innerHTML = `<strong>Merci ${safeNom} !</strong><br>Votre demande pour <strong>${safeCouverts}</strong> le <strong>${safeDate}</strong> à <strong>${safeHeure}</strong> a été transmise au restaurant.<br><span style="font-size: 0.82rem; opacity: 0.85;">Confirmation directe par SMS/Appel au ${safeTel}.</span>`;

        form.appendChild(successBox);

        setTimeout(() => {
          form.reset();
          if (btn) {
            btn.classList.remove('is-success');
            btn.disabled = false;
            btn.textContent = 'Confirmer ma réservation';
          }
        }, 6000);
      }, 1000);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 8. LIGHTBOX GALERIE PHOTO PLEIN ÉCRAN
  // ─────────────────────────────────────────────────────────────
  function initGalleryLightbox() {
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox-modal';
      lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(13,27,42,0.95);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);z-index:9999;display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out;opacity:0;transition:opacity 0.25s ease;';
      lightbox.innerHTML = `
        <button id="lightbox-close" aria-label="Fermer" style="position:absolute;top:24px;right:24px;background:none;border:none;color:#E8DFC8;font-size:2rem;cursor:pointer;line-height:1;padding:8px 14px;">✕</button>
        <img id="lightbox-img" src="" alt="Photographie Restaurant BOBY" style="max-width:92vw;max-height:86vh;border-radius:3px;box-shadow:0 12px 48px rgba(0,0,0,0.6);object-fit:contain;cursor:default;">
        <p id="lightbox-caption" style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);color:#E8DFC8;font-family:'Fraunces',serif;font-size:1.15rem;letter-spacing:0.02em;text-align:center;background:rgba(13,27,42,0.85);padding:8px 22px;border-radius:20px;max-width:90%;"></p>
      `;
      document.body.appendChild(lightbox);
    }

    const lbImg = lightbox.querySelector('#lightbox-img');
    const lbCaption = lightbox.querySelector('#lightbox-caption');
    const lbClose = lightbox.querySelector('#lightbox-close');

    function openLb(src, caption) {
      lbImg.src = src;
      lbCaption.textContent = caption || 'Restaurant BOBY — La Baie des Isles';
      lightbox.style.display = 'flex';
      requestAnimationFrame(() => { lightbox.style.opacity = '1'; });
      document.body.style.overflow = 'hidden';
    }

    function closeLb() {
      lightbox.style.opacity = '0';
      setTimeout(() => {
        lightbox.style.display = 'none';
        lbImg.src = '';
      }, 250);
      document.body.style.overflow = '';
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lbClose) closeLb();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLb();
    });

    document.querySelectorAll('.galerie-item').forEach(item => {
      item.style.cursor = 'zoom-in';
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          const caption = item.querySelector('.galerie-caption')?.textContent || img.alt;
          openLb(img.src, caption);
        }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 9. ANNÉE DU FOOTER
  // ─────────────────────────────────────────────────────────────
  function initYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ─────────────────────────────────────────────────────────────
  // 10. HERO — poussière dorée, parallaxe, indication de défilement
  // ─────────────────────────────────────────────────────────────
  function initHero() {
    const hero  = document.getElementById('hero');
    const stage = document.getElementById('hero-stage');
    const logo  = document.getElementById('hero-logo-wrap');
    const cv    = document.getElementById('hero-motes');
    const cue   = document.getElementById('hero-scroll');
    if (!hero || !stage) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (cue) {
      cue.addEventListener('click', () => {
        const next = hero.nextElementSibling;
        if (next) next.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      });
    }
    if (reduced) return;

    // Parallaxe : défilement (le bloc remonte et s'efface) + souris (desktop)
    let px = 0, py = 0, tx = 0, ty = 0, heroVisible = true, raf = 0;
    function frame() {
      raf = 0;
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      const sy = Math.min(window.scrollY, hero.offsetHeight);
      stage.style.transform = 'translate3d(0,' + (-sy * 0.14).toFixed(1) + 'px,0)';
      stage.style.opacity = Math.max(0, 1 - sy / (hero.offsetHeight * 0.75)).toFixed(3);
      if (logo) logo.style.transform = 'translate3d(' + (px * 12).toFixed(2) + 'px,' + (py * 9).toFixed(2) + 'px,0)';
      if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) request();
    }
    function request() { if (!raf && heroVisible) raf = requestAnimationFrame(frame); }
    window.addEventListener('scroll', request, { passive: true });
    if (fine) {
      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        request();
      }, { passive: true });
      hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; request(); });
    }

    // Poussière de lumière : quelques particules qui montent lentement
    if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, dpr = 1, motes = [], running = false;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = w < 600 ? 26 : 54;
      motes = Array.from({ length: n }, () => spawn(true));
    }
    function spawn(anywhere) {
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 10,
        r: 0.6 + Math.random() * 1.8,
        v: 6 + Math.random() * 14,
        sway: 8 + Math.random() * 18,
        ph: Math.random() * 6.28,
        tw: 0.4 + Math.random() * 0.9,
        a: 0.15 + Math.random() * 0.5
      };
    }
    let last = 0;
    function tick(t) {
      if (!running) return;
      const dt = Math.min((t - last) / 1000 || 0.016, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.v * dt;
        m.ph += m.tw * dt;
        if (m.y < -10) Object.assign(m, spawn(false));
        const x = m.x + Math.sin(m.ph) * m.sway;
        const edge = Math.min(1, Math.max(0, m.y / (h * 0.25)), (h - m.y) / (h * 0.15) + 0.3);
        ctx.globalAlpha = m.a * (0.55 + 0.45 * Math.sin(m.ph * 2.1)) * edge;
        ctx.fillStyle = '#F0E2C0';
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, 6.2832);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    function setRunning(on) {
      if (on && !running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
      else if (!on) running = false;
    }
    resize();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => {
        heroVisible = en[0].isIntersecting;
        setRunning(heroVisible && !document.hidden);
      }).observe(hero);
    } else setRunning(true);
    document.addEventListener('visibilitychange', () => setRunning(heroVisible && !document.hidden));
  }

  // ─────────────────────────────────────────────────────────────
  // 11. BARRE D'ACTIONS MOBILE (visible après le hero)
  // ─────────────────────────────────────────────────────────────
  function initMobileBar() {
    const bar = document.getElementById('mobile-bar');
    if (!bar) return;
    let ticking = false;
    function update() {
      ticking = false;
      const menuOpen = document.getElementById('mobile-menu')?.getAttribute('aria-hidden') === 'false';
      bar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6 && !menuOpen);
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    document.getElementById('burger-btn')?.addEventListener('click', () => setTimeout(update, 0));
    window.addEventListener('hashchange', () => setTimeout(update, 50));
    update();
  }

  // ─────────────────────────────────────────────────────────────
  // 12. APPARITIONS AU DÉFILEMENT (sobres, retirées une fois jouées)
  // ─────────────────────────────────────────────────────────────
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sel = '.intro-title, .intro-text, .chef-photo-frame, .chef-content, .carte-header, .plat-item, .galerie-header, .galerie-item, .avis-editorial-header, .michelin-guide-card, .page-header, .resa-form';
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        el.classList.add('is-in');
        setTimeout(() => el.classList.remove('reveal', 'is-in'), 1400);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll(sel).forEach((el) => {
      const idx = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty('--d', Math.min(idx, 4) * 90 + 'ms');
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // DÉMARRAGE GLOBAL
  document.addEventListener('DOMContentLoaded', () => {
    initRouting();
    initHeaderScroll();
    initMobileMenu();
    initCustomCursor();
    initReservation();
    initGalleryLightbox();
    initYear();
    initHero();
    initMobileBar();
    initReveal();
  });

})();
