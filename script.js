/**
 * Restaurant BOBY — Script principal
 * Fonctionnalités :
 *  1. Header scroll-morph (transparent → fond nuit)
 *  2. Navigation burger mobile
 *  3. Logo hero parallax au scroll
 *  4. Galerie mobile — dots synchronisés
 *  5. Validation du formulaire de réservation
 *  6. Curseur personnalisé (desktop uniquement)
 *  7. Année footer dynamique
 */

/* ================================================================
   1. HEADER SCROLL-MORPH
   ================================================================ */
(function initScrollHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
})();

/* ================================================================
   2. BURGER — MENU MOBILE
   ================================================================ */
(function initBurger() {
  const btn    = document.getElementById('burger-btn');
  const menu   = document.getElementById('mobile-menu');
  const links  = menu ? menu.querySelectorAll('.mobile-nav-link') : [];
  if (!btn || !menu) return;

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Fermer au clic sur un lien
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermer avec Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ================================================================
   3. LOGO HERO — PARALLAX AU SCROLL
   Micro-parallax discret : logo remonte légèrement au scroll.
   Désactivé si prefers-reduced-motion.
   ================================================================ */
(function initHeroParallax() {
  // Vérifier prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const logoWrap = document.getElementById('hero-logo-wrap');
  const heroCta  = document.getElementById('hero-cta-wrap');
  if (!logoWrap) return;

  let ticking = false;

  function applyParallax() {
    const scrollY = window.scrollY;
    const vy = Math.min(scrollY * 0.18, 80); // plafond pour éviter les excès
    logoWrap.style.transform = `translateY(${-vy}px)`;
    if (heroCta) {
      heroCta.style.transform = `translateY(${-vy * 0.6}px)`;
      heroCta.style.opacity = `${Math.max(0, 1 - scrollY / 300)}`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });
})();

/* ================================================================
   4. GALERIE MOBILE — DOTS SYNCHRONISÉS
   ================================================================ */
(function initGalerieDots() {
  const track = document.getElementById('galerie-track');
  const dots  = document.querySelectorAll('.galerie-dots .dot');
  if (!track || !dots.length) return;

  // Récupère les éléments .galerie-item directement (même si dans .galerie-col-right)
  // Sur mobile, les enfants de .galerie-col-right sont en display:contents donc
  // ils rejoignent le flex de .galerie-track
  let items = [];

  function gatherItems() {
    items = Array.from(track.querySelectorAll('.galerie-item'));
  }

  gatherItems();

  // Détecter l'item visible via IntersectionObserver
  let currentIdx = 0;

  function setActiveDot(idx) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('dot--active', i === idx);
    });
  }

  // Sur mobile (overflow scroll), utiliser l'Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = items.indexOf(entry.target);
        if (idx !== -1) {
          currentIdx = idx;
          setActiveDot(idx);
        }
      }
    });
  }, {
    root: track,
    threshold: 0.6
  });

  function observeItems() {
    gatherItems();
    items.forEach(item => observer.observe(item));
  }

  observeItems();

  // Re-observer si la mise en page change (responsive)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      items.forEach(item => observer.unobserve(item));
      observeItems();
    }, 250);
  });
})();

/* ================================================================
   5. FORMULAIRE DE RÉSERVATION — VALIDATION
   ================================================================ */
(function initReservationForm() {
  const form = document.getElementById('resa-form');
  if (!form) return;

  const submitBtn = document.getElementById('btn-resa-submit');

  // Champs obligatoires et leurs messages d'erreur
  const fields = [
    { id: 'resa-nom',      errorId: 'resa-nom-error',      msg: 'Veuillez indiquer votre nom et prénom.' },
    { id: 'resa-tel',      errorId: 'resa-tel-error',       msg: 'Veuillez indiquer un numéro de téléphone.' },
    { id: 'resa-date',     errorId: 'resa-date-error',      msg: 'Veuillez choisir une date.' },
    { id: 'resa-heure',    errorId: 'resa-heure-error',     msg: 'Veuillez choisir une heure.' },
    { id: 'resa-couverts', errorId: 'resa-couverts-error',  msg: 'Veuillez indiquer le nombre de couverts.' },
  ];

  // Validation individuelle
  function validateField(fieldId, errorId, msg) {
    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(errorId);
    if (!input || !errEl) return true;

    const valid = input.value.trim() !== '';
    errEl.textContent = valid ? '' : msg;
    input.classList.toggle('is-error', !valid);
    return valid;
  }

  // Effacer erreur au focus
  fields.forEach(({ id, errorId }) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = '';
        input.classList.remove('is-error');
      });
    }
  });

  // Vérifier que la date n'est pas un mercredi ou jeudi
  function validateDate(dateVal) {
    if (!dateVal) return { ok: false, msg: 'Veuillez choisir une date.' };
    const d = new Date(dateVal + 'T12:00:00');
    const day = d.getDay(); // 0=dim, 3=mer, 4=jeu
    if (day === 3 || day === 4) {
      return { ok: false, msg: 'Le restaurant est fermé le mercredi et le jeudi. Choisissez un autre jour.' };
    }
    // Vérifier que la date n'est pas dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) {
      return { ok: false, msg: 'Veuillez choisir une date à venir.' };
    }
    return { ok: true };
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let allValid = true;

    // Valider les champs simples
    fields.forEach(({ id, errorId, msg }) => {
      if (!validateField(id, errorId, msg)) allValid = false;
    });

    // Validation spécifique de la date (mercredi/jeudi/passé)
    const dateInput = document.getElementById('resa-date');
    const dateError = document.getElementById('resa-date-error');
    if (dateInput && dateError) {
      const dateCheck = validateDate(dateInput.value);
      if (!dateCheck.ok) {
        dateError.textContent = dateCheck.msg;
        dateInput.classList.add('is-error');
        allValid = false;
      }
    }

    if (!allValid) {
      // Focus sur le premier champ en erreur
      const firstError = form.querySelector('.is-error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulation d'envoi (à remplacer par votre backend / service email)
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.classList.add('is-success');

      // Reset du formulaire après 3s
      setTimeout(() => {
        form.reset();
        submitBtn.classList.remove('is-success');
        submitBtn.disabled = false;
      }, 3000);
    }, 1600);
  });
})();

/* ================================================================
   6. CURSEUR PERSONNALISÉ — desktop uniquement
   Désactivé sur tactile (pointer: coarse)
   ================================================================ */
(function initCustomCursor() {
  // Détecter pointer fine (souris)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Créer l'élément curseur
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    if (!ticking) {
      requestAnimationFrame(() => {
        cursor.style.left = cx + 'px';
        cursor.style.top  = cy + 'px';
        ticking = false;
      });
      ticking = true;
    }
  });

  // Agrandir sur les éléments interactifs
  const interactiveSelector = 'a, button, input, select, textarea, label, .galerie-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add('is-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.remove('is-hover');
    }
  });
})();

/* ================================================================
   7. ANNÉE FOOTER DYNAMIQUE
   ================================================================ */
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ================================================================
   8. SCROLL DOUX — ancres navigation
   (HTML scroll-behavior: smooth gère la plupart des cas,
    ceci est un fallback pour Safari iOS)
   ================================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 72;

      const offsetTop = target.getBoundingClientRect().top + window.scrollY - headerH;

      // Respect de prefers-reduced-motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReduced && 'scrollBehavior' in document.documentElement.style) {
        // Laisse le CSS smooth gérer
        return;
      }

      e.preventDefault();
      window.scrollTo({ top: offsetTop });
    });
  });
})();
