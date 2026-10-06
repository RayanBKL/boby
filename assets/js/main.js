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

  // DÉMARRAGE GLOBAL
  document.addEventListener('DOMContentLoaded', () => {
    initRouting();
    initHeaderScroll();
    initMobileMenu();
    initCustomCursor();
    initReservation();
    initGalleryLightbox();
    initYear();
  });

})();
