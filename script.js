/**
 * ==========================================================================
 * PORTFOLIO PROFESIONAL — GEMA ESPADA
 * Desarrolladora Full Stack en formación
 * Lógica e interactividad: script.js
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de todas las funcionalidades
  initMobileMenu();
  initHeaderScroll();
  initActiveNavOnScroll();
  initScrollReveal();
  initContactForm();
  initDynamicYear();
});

/**
 * 1. Control del menú de navegación en dispositivos móviles
 */
function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

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
    if (window.innerWidth > 768 && navMenu.classList.contains('is-active')) {
      navMenu.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 2. Efecto visual en la barra de navegación superior al desplazarse (scroll)
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Verificación inicial
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
    '.section-header, .about-intro, .trait, .idea-panel, .edu-item, .module, .skill-group, .cert-item, .contact-channels, .contact-form-card'
  );

  elementsToReveal.forEach((el) => el.classList.add('reveal-item'));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const notification = document.getElementById('form-notification');
  if (!form || !notification) return;

  const mailLink = document.querySelector('a[href^="mailto:"]');
  const recipient = mailLink ? mailLink.getAttribute('href').replace('mailto:', '') : '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const fields = {
    name: (v) => (v ? '' : 'Escribe tu nombre.'),
    email: (v) => (!v ? 'Escribe tu correo electrónico.' : emailPattern.test(v) ? '' : 'Introduce un correo válido, por ejemplo nombre@dominio.com.'),
    message: (v) => (v ? '' : 'Escribe tu mensaje.')
  };

  function setError(name, text) {
    const input = form.elements[name];
    const out = document.getElementById(`error-${name}`);
    if (out) out.textContent = text;
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
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
      showNotification('Revisa los campos marcados antes de continuar.', 'error');
      return;
    }

    if (!recipient) {
      showNotification('No se ha podido preparar el mensaje. Inténtalo de nuevo más tarde.', 'error');
      return;
    }

    const subject = `Mensaje desde tu web de ${values.name}`;
    const body = `${values.message}\n\n—\n${values.name}\n${values.email}`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    showNotification(
      `Se ha abierto tu aplicación de correo con el mensaje preparado. El mensaje no se envía hasta que lo mandes desde ella. Si no se abre, escribe a ${recipient}.`,
      'success'
    );
  });

  function showNotification(text, type) {
    notification.textContent = text;
    notification.className = `form-notification is-${type}`;
  }
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
