/**
 * ==========================================================================
 * PORTFOLIO PROFESIONAL — GEMA ESPADA
 * Desarrolladora Full Stack en formación
 * Lógica e interactividad: script.js
 * (Las traducciones están en i18n.js)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de todas las funcionalidades
  initI18n();
  initTheme();
  initMobileMenu();
  initHeaderScroll();
  initActiveNavOnScroll();
  initScrollReveal();
  initContactForm();
  initWhatsAppFloat();
  initDynamicYear();
});

/* --------------------------------------------------------------------------
   Utilidades de almacenamiento (el almacenamiento local puede no estar
   disponible, por ejemplo en navegación privada: se ignora el error)
   -------------------------------------------------------------------------- */
const store = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* sin persistencia */ } }
};

/* --------------------------------------------------------------------------
   Idioma (ES / EN)
   -------------------------------------------------------------------------- */
const langState = { current: 'es', listeners: [] };

/** Devuelve el texto traducido a partir de su clave, sustituyendo {variables}. */
function t(key, vars) {
  const dict = window.I18N || { es: {}, en: {} };
  let text = (dict[langState.current] && dict[langState.current][key]);
  if (text === undefined) text = dict.es[key];
  if (text === undefined) return key;
  if (vars) Object.keys(vars).forEach((name) => { text = text.split(`{${name}}`).join(vars[name]); });
  return text;
}

/**
 * 0. Selector de idioma: el texto en español se toma del propio HTML y las
 * traducciones al inglés de i18n.js. Se recuerda la preferencia del visitante.
 */
function initI18n() {
  const dict = window.I18N;
  if (!dict) return;

  // Captura del español original (el HTML se carga siempre en español)
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!(key in dict.es)) dict.es[key] = el.textContent.trim();
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    parseAttrMap(el).forEach(({ attr, key }) => {
      if (!(key in dict.es)) dict.es[key] = el.getAttribute(attr) || '';
    });
  });

  const buttons = document.querySelectorAll('.lang-btn');
  buttons.forEach((btn) => btn.addEventListener('click', () => setLanguage(btn.dataset.lang, true)));

  const saved = store.get('portfolio-lang');
  setLanguage(saved === 'en' ? 'en' : 'es', false);
}

function parseAttrMap(el) {
  return el.getAttribute('data-i18n-attr').split(';').filter(Boolean).map((pair) => {
    const idx = pair.indexOf(':');
    return { attr: pair.slice(0, idx), key: pair.slice(idx + 1) };
  });
}

function setLanguage(lang, persist) {
  langState.current = lang === 'en' ? 'en' : 'es';
  document.documentElement.setAttribute('lang', langState.current);
  if (persist) store.set('portfolio-lang', langState.current);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    parseAttrMap(el).forEach(({ attr, key }) => el.setAttribute(attr, t(key)));
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === langState.current));
  });

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute('content', langState.current === 'en' ? 'en_US' : 'es_ES');

  updateThemeLabel();
  updateWhatsAppLink();
  langState.listeners.forEach((fn) => fn());
}

function onLanguageChange(fn) { langState.listeners.push(fn); }

/* --------------------------------------------------------------------------
   Tema claro / oscuro
   -------------------------------------------------------------------------- */
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function updateThemeLabel() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const label = t(currentTheme() === 'dark' ? 'theme.toLight' : 'theme.toDark');
  btn.setAttribute('aria-label', label);
  btn.setAttribute('title', label);
}

/**
 * 0b. Selector de tema (claro por defecto). La preferencia se guarda en
 * localStorage y se aplica antes del primer pintado desde el <head>.
 */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const metaColor = document.getElementById('meta-theme-color');
  const syncMeta = () => { if (metaColor) metaColor.setAttribute('content', currentTheme() === 'dark' ? '#0a0f24' : '#ffffff'); };
  syncMeta();
  updateThemeLabel();
  if (!btn) return;

  btn.addEventListener('click', () => {
    const root = document.documentElement;
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    // La clase de transición solo existe durante el cambio para no penalizar el rendimiento
    root.classList.add('theme-transition');
    root.setAttribute('data-theme', next);
    store.set('portfolio-theme', next);
    syncMeta();
    updateThemeLabel();
    window.setTimeout(() => root.classList.remove('theme-transition'), 450);
  });
}

/**
 * 1. Control del menú de navegación en dispositivos móviles
 */
function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const BREAKPOINT = 1080; // debe coincidir con el @media del CSS

  if (!navToggle || !navMenu) return;

  // Alternar apertura y cierre del menú
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('is-active');
  });

  // Cerrar menú automáticamente al pulsar sobre cualquier enlace de navegación
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
      navMenu.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  // Cerrar si se redimensiona a pantalla de escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > BREAKPOINT && navMenu.classList.contains('is-active')) {
      navMenu.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 2. Efecto visual en la barra de navegación superior al desplazarse (scroll)
 * y barra de progreso de lectura.
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const progress = document.getElementById('scroll-progress');
  if (!header) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--progress', max > 0 ? Math.min(window.scrollY / max, 1).toFixed(4) : 0);
    }
  };
  const handleScroll = () => {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  update(); // Verificación inicial
}

/**
 * 3. Detección y resaltado de la sección activa en el menú de navegación
 */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * 4. Animaciones suaves de aparición de tarjetas y contenidos al hacer scroll
 */
function initScrollReveal() {
  // Elementos a los que aplicamos la animación de entrada suave
  const elementsToReveal = document.querySelectorAll(
    '.section-header, .about-intro, .trait, .idea-panel, .edu-item, .module, .skills-legend, .skill-cat-head, .skill-card, .cert-extra-title, .cert-item, .contact-channels, .contact-form-card'
  );

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  elementsToReveal.forEach((el) => el.classList.add('reveal-item'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    elementsToReveal.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      let order = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Pequeño escalonado entre elementos que aparecen a la vez
          entry.target.style.setProperty('--reveal-delay', `${Math.min(order * 70, 280)}ms`);
          order += 1;
          entry.target.classList.add('is-visible');
          // Una vez revelado, dejamos de observarlo para un rendimiento óptimo
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elementsToReveal.forEach((el) => observer.observe(el));
}

/**
 * 5. Formulario de contacto
 * No hay servicio de envío configurado: tras validar los campos se abre el
 * cliente de correo del usuario (mailto) con el mensaje ya redactado, usando
 * la dirección de correo que ya figura en la página.
 * Los mensajes se traducen y se vuelven a pintar al cambiar de idioma.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const notification = document.getElementById('form-notification');
  if (!form || !notification) return;

  const mailLink = document.querySelector('a[href^="mailto:"]');
  const recipient = mailLink ? mailLink.getAttribute('href').replace('mailto:', '') : '';
  // Texto@dominio.tld: sin espacios, sin puntos consecutivos en el dominio y con extensión de 2+ letras
  const emailPattern = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$/;

  // Cada validador devuelve la clave de traducción del error ('' si es válido)
  const fields = {
    name: (v) => (v ? '' : 'err.name'),
    email: (v) => (!v ? 'err.email.empty' : emailPattern.test(v) ? '' : 'err.email.invalid'),
    message: (v) => (v ? '' : 'err.message')
  };

  const errorKeys = {};
  let lastNotice = null; // { key, vars, type }

  function setError(name, key) {
    const input = form.elements[name];
    const out = document.getElementById(`error-${name}`);
    errorKeys[name] = key;
    if (out) out.textContent = key ? t(key) : '';
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
  }

  // Limpia el error de un campo al corregirlo
  Object.keys(fields).forEach((name) => {
    form.elements[name].addEventListener('input', () => setError(name, ''));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    notification.className = 'form-notification';

    const values = {};
    let firstInvalid = null;
    Object.keys(fields).forEach((name) => {
      values[name] = form.elements[name].value.trim();
      const error = fields[name](values[name]);
      setError(name, error);
      if (error && !firstInvalid) firstInvalid = form.elements[name];
    });

    if (firstInvalid) {
      firstInvalid.focus();
      showNotification('form.review', 'error');
      return;
    }

    if (!recipient) {
      showNotification('form.noRecipient', 'error');
      return;
    }

    const subject = t('form.subject', { name: values.name });
    const body = `${values.message}\n\n—\n${values.name}\n${values.email}`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    showNotification('form.success', 'success', { email: recipient });
  });

  function showNotification(key, type, vars) {
    lastNotice = { key, type, vars };
    notification.textContent = t(key, vars);
    notification.className = `form-notification is-${type}`;
  }

  // Al cambiar de idioma se vuelven a traducir errores y avisos visibles
  onLanguageChange(() => {
    Object.keys(errorKeys).forEach((name) => {
      const out = document.getElementById(`error-${name}`);
      if (out) out.textContent = errorKeys[name] ? t(errorKeys[name]) : '';
    });
    if (lastNotice && notification.classList.contains(`is-${lastNotice.type}`)) {
      notification.textContent = t(lastNotice.key, lastNotice.vars);
    }
  });
}

/**
 * 5b. WhatsApp: el mensaje inicial del botón flotante cambia con el idioma y el
 * botón se aparta mientras el formulario está a la vista en pantallas pequeñas,
 * para no taparlo.
 */
function updateWhatsAppLink() {
  const float = document.getElementById('wa-float');
  if (!float) return;
  const base = float.getAttribute('href').split('?')[0];
  float.setAttribute('href', `${base}?text=${encodeURIComponent(t('wa.text'))}`);
}

function initWhatsAppFloat() {
  const float = document.getElementById('wa-float');
  const formCard = document.querySelector('.contact-form-card');
  if (!float || !formCard || !('IntersectionObserver' in window)) return;

  const narrow = window.matchMedia('(max-width: 1100px)');
  let formVisible = false;
  const apply = () => float.classList.toggle('is-dimmed', formVisible && narrow.matches);

  new IntersectionObserver((entries) => {
    formVisible = entries[0].isIntersecting;
    apply();
  }, { threshold: 0.05 }).observe(formCard);

  narrow.addEventListener('change', apply);
}

/**
 * 6. Actualización dinámica del año actual en el copyright del footer
 */
function initDynamicYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
