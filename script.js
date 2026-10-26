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
  const navLinks = document.querySelectorAll('.nav-link, .nav-item-cta .btn');

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
    '.card, .hero-content, .hero-visual, .section-header, .continuous-learning-card'
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
 * 5. Manejo del formulario de contacto con feedback amigable
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const notification = document.getElementById('form-notification');
  const submitBtn = document.getElementById('btn-submit-contact');

  if (!form || !notification) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim() || '';
    const email = form.elements['email']?.value.trim() || '';
    const message = form.elements['message']?.value.trim() || '';

    // Validación básica de campos requeridos
    if (!name || !email || !message) {
      showNotification('Por favor, completa todos los campos del formulario.', 'error');
      return;
    }

    // Efecto de envío interactivo
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando...</span>`;
    }

    setTimeout(() => {
      // Notificación de éxito
      showNotification(
        `¡Gracias por tu mensaje, ${name}! Tu solicitud ha sido registrada correctamente. Me pondré en contacto contigo pronto.`,
        'success'
      );

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Enviar mensaje</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
      }
    }, 700);
  });

  function showNotification(text, type) {
    notification.textContent = text;
    notification.className = `form-notification is-${type}`;
    
    // Ocultar notificación tras 7 segundos si es de éxito
    if (type === 'success') {
      setTimeout(() => {
        notification.className = 'form-notification';
      }, 7000);
    }
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
