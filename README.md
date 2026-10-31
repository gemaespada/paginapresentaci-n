# Gema Espada | Desarrolladora Full Stack en formación

Portfolio personal minimalista, bilingüe (ES/EN) y responsive (HTML, CSS y JavaScript) con paleta en azul marino, blancos y neutros, modo claro/oscuro y buenas prácticas de accesibilidad y SEO.

## Secciones
1. **Inicio**: presentación con perfil «Desarrolladora Full Stack en formación» y llamadas a la acción.
2. **Sobre mí**: transición profesional desde la Educación Primaria Bilingüe hacia el desarrollo de software.
3. **Formación**: estudios académicos y módulos completados del máster (incluye IA Google Antigravity como módulo completado).
4. **Conocimientos**: tecnologías y herramientas organizadas de forma minimalista en 5 áreas (programación, bases de datos, control de versiones/entornos, IA aplicada al desarrollo e infraestructura/despliegue).
5. **Certificaciones**: los 5 certificados oficiales obtenidos (Pseudocódigo, Python, Linux y la Terminal, Git y GitHub, Python avanzado).
6. **Llamada a la acción («¿Tienes una idea? Hagámosla realidad»)**: propuesta de desarrollo web y de aplicaciones que enlaza a Contacto.
7. **Contacto**: canales directos (correo, LinkedIn, GitHub, WhatsApp con botón flotante) y formulario de contacto accesible.

## Ver en local
Abre `index.html` en tu navegador, o ejecuta:
```bash
python3 -m http.server 8080
```
y visita `http://localhost:8080`.

## Archivos del proyecto
- `index.html`: estructura semántica, marcado accesible, SEO y contenidos base en español.
- `style.css`: estilos, diseño fluido responsive, variables temáticas (modo claro y modo oscuro) y animaciones sutiles.
- `script.js`: lógica de selectores (idioma y tema), menú móvil, sección activa en scroll, animaciones y validación de formulario.
- `i18n.js`: traducciones completas al inglés y mensajes interactivos.
- `favicon.svg`, `favicon.ico`, `favicon-*.png`, `apple-touch-icon.png`, `site.webmanifest`: favicons e iconos de aplicación basados en el monograma «GE».
- `assets/og-image.png`: imagen Open Graph para compartir en LinkedIn y redes sociales (1200×630).
- `robots.txt`, `sitemap.xml`: directivas para motores de búsqueda y mapa del sitio.
- `set-site-url.sh`: script de utilidad para configurar el dominio definitivo una vez publicado.
- `.gitignore`: exclusión de archivos del sistema operativo, entornos y temporales.

## Configuración de dominio antes de publicar
El proyecto incluye el marcador `__SITE_URL__` en los metadatos canónicos, Open Graph y sitemap para evitar enlaces rotos o inventados. Una vez que tengas tu dominio definitivo (por ejemplo en Cloudflare Pages), ejecuta:
```bash
./set-site-url.sh https://tu-dominio.com
```

## Idiomas y temas
- El idioma base está en el HTML; los textos en inglés se configuran mediante claves `data-i18n` en `i18n.js`.
- Las preferencias de idioma y tema (claro/oscuro) se memorizan en el navegador (`localStorage`).
