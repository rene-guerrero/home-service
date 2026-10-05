// Internacionalización (ES | EN) y modo oscuro para el sitio público.
(function () {
  const LANG_KEY = 'hs-lang';
  const THEME_KEY = 'hs-theme';
  const SUPPORTED = ['es', 'en'];

  const dictionary = {
    es: {
      'meta.title': 'Home Service HLG — Energía solar y estructuras metálicas',
      'meta.description': 'Instalación de paneles solares, estructuras metálicas, electricidad y plomería en Holguín. Consulta inicial sin costo.',

      'nav.services': 'Servicios',
      'nav.solar': 'Energía solar',
      'nav.metal': 'Estructuras metálicas',
      'nav.gallery': 'Galería',
      'nav.contact': 'Contacto',
      'nav.toggle': 'Abrir menú de navegación',
      'ui.theme': 'Cambiar tema',
      'ui.language': 'Cambiar idioma',
      'ui.backToTop': 'Volver arriba',

      'hero.eyebrow': 'Home Service HLG',
      'hero.title': 'Construimos tu futuro con acero y energía solar',
      'hero.subtitle': 'Soluciones solares, estructuras metálicas, electricidad y plomería con acabados profesionales y resultados duraderos.',
      'hero.cta': 'Contáctanos',
      'hero.cta2': 'Ver servicios',
      'hero.logoAlt': 'Logotipo de Home Service HLG',

      'services.title': '¿Qué le ofrecemos?',
      'services.subtitle': 'Servicios integrales para tu hogar o negocio.',
      'services.solar.title': 'Instalación de paneles solares',
      'services.solar.text': 'Explora la posibilidad de liberarte de la red eléctrica, reducir tus facturas y contribuir al cuidado del planeta.',
      'services.solar.alt': 'Instalación de paneles solares',
      'services.metal.title': 'Estructuras metálicas',
      'services.metal.text': 'Servicio de techado y fabricación de estructuras metálicas a medida. Soportes resistentes para paneles solares.',
      'services.metal.alt': 'Estructura metálica a medida',
      'services.electric.title': 'Servicio de electricidad',
      'services.electric.text': 'Desde instalaciones hasta reparaciones de emergencia, brindamos servicios eléctricos seguros, confiables y asequibles.',
      'services.electric.alt': 'Servicio eléctrico',
      'services.plumbing.title': 'Servicio de plomería',
      'services.plumbing.text': 'Instalación y montaje de bombas, calentadores, presurizadores y lavamanos, además de plomería completa para baños con acabados profesionales.',
      'services.plumbing.alt': 'Servicio de plomería',

      'solar.title': 'Soluciones solares confiables',
      'solar.intro1': 'La energía solar es el camino hacia un hogar más sostenible.',
      'solar.intro2': 'En <strong class="brand-text">Home Service HLG</strong> te ayudamos a dar el primer paso. Nos especializamos en:',
      'solar.item1': 'Cálculos de dimensionamiento de sistemas solares, garantizando que tu instalación se adapte a tus necesidades energéticas específicas.',
      'solar.item2': 'Fabricación de soportes personalizados para paneles solares, hechos a medida para tu hogar o negocio.',
      'solar.item3': 'Configuración e instalación de sistemas solares, asegurando un funcionamiento óptimo y eficiente que ahorre energía y dinero a largo plazo.',
      'solar.item4': 'Transformamos la energía del sol en una fuente de ahorro y sostenibilidad, con soluciones económicas y ecológicas.',
      'solar.note': 'Descubre tu potencial solar hoy: la consulta inicial es libre de costos.',
      'solar.badge': 'Consulta inicial gratis',
      'solar.t1': 'Dimensionamiento',
      'solar.t2': 'Soportes a medida',
      'solar.t3': 'Instalación y puesta en marcha',
      'solar.t4': 'Ahorro y sostenibilidad',
      'solar.alt1': 'Paneles solares instalados',
      'solar.alt2': 'Detalle de instalación solar',
      'solar.alt3': 'Sistema solar residencial',

      'metal.title': 'Estructuras metálicas a la medida',
      'metal.p1': 'Nos dedicamos al diseño y fabricación de estructuras metálicas y techados, ofreciendo soluciones sólidas, duraderas y estéticamente diseñadas para adaptarse a las necesidades de cada cliente.',
      'metal.t1': 'Te acompañamos en cada etapa',
      'metal.p2': 'Escuchamos, planificamos y ejecutamos con precisión y eficiencia, en tiempos competitivos y sin comprometer la calidad.',
      'metal.t2': 'Precisión técnica',
      'metal.p3': 'Dominamos procesos modernos de soldadura y ensamblaje para crear estructuras rígidas y estables, desde techados residenciales hasta proyectos más complejos.',
      'metal.cta': 'Solicita tu presupuesto',
      'metal.p4': 'En Home Service HLG no solo construimos estructuras: construimos confianza, seguridad y bienestar.',
      'metal.prev': 'Imagen anterior',
      'metal.next': 'Imagen siguiente',
      'metal.slide': 'Proyecto de estructura metálica',

      'lb.label': 'Foto del proyecto',
      'lb.close': 'Cerrar',
      'lb.prev': 'Foto anterior',
      'lb.next': 'Foto siguiente',
      'gallery.title': 'Nuestra galería',
      'gallery.subtitle': 'Algunos de nuestros trabajos recientes.',
      'gallery.img001': 'Estructura metálica en construcción',
      'gallery.img002': 'Estructura para techado',
      'gallery.img003': 'Inversor híbrido y protecciones',
      'gallery.img004': 'Paneles solares en azotea',
      'gallery.img005': 'Calentador de agua y bomba',
      'gallery.img006': 'Panel de protecciones eléctricas',
      'gallery.img007': 'Paneles sobre soporte metálico',
      'gallery.img008': 'Soldadura de estructura',
      'gallery.img009': 'Portón de láminas metálicas',
      'gallery.img010': 'Techado metálico',
      'gallery.img011': 'Caseta metálica',
      'gallery.img012': 'Estructura metálica sobre muro',

      'contact.title': 'Contáctanos',
      'contact.text': 'Estamos disponibles para ayudarte con tu proyecto.',
      'footer.tagline': 'Construimos tu futuro con acero y energía solar.',
      'footer.nav': 'Navegación',
      'contact.fb': 'Síguenos',
      'footer.rights': 'Todos los derechos reservados'
    },
    en: {
      'meta.title': 'Home Service HLG — Solar energy and metal structures',
      'meta.description': 'Solar panel installation, custom metal structures, electrical and plumbing services in Holguín. Free initial consultation.',

      'nav.services': 'Services',
      'nav.solar': 'Solar energy',
      'nav.metal': 'Metal structures',
      'nav.gallery': 'Gallery',
      'nav.contact': 'Contact',
      'nav.toggle': 'Toggle navigation menu',
      'ui.theme': 'Toggle theme',
      'ui.language': 'Change language',
      'ui.backToTop': 'Back to top',

      'hero.eyebrow': 'Home Service HLG',
      'hero.title': 'We build your future with steel and solar energy',
      'hero.subtitle': 'Solar solutions, metal structures, electrical and plumbing work with professional finishes and lasting results.',
      'hero.cta': 'Contact us',
      'hero.cta2': 'See services',
      'hero.logoAlt': 'Home Service HLG logo',

      'services.title': 'What we offer',
      'services.subtitle': 'End-to-end services for your home or business.',
      'services.solar.title': 'Solar panel installation',
      'services.solar.text': 'Break free from the grid, lower your electricity bills and help take care of the planet.',
      'services.solar.alt': 'Solar panel installation',
      'services.metal.title': 'Metal structures',
      'services.metal.text': 'Roofing and custom metal fabrication, including sturdy mounts for solar panels.',
      'services.metal.alt': 'Custom metal structure',
      'services.electric.title': 'Electrical services',
      'services.electric.text': 'From new installations to emergency repairs, we provide safe, reliable and affordable electrical work.',
      'services.electric.alt': 'Electrical service',
      'services.plumbing.title': 'Plumbing services',
      'services.plumbing.text': 'Installation of pumps, water heaters, pressure systems and sinks, plus complete bathroom plumbing with professional finishes.',
      'services.plumbing.alt': 'Plumbing service',

      'solar.title': 'Reliable solar solutions',
      'solar.intro1': 'Solar energy is the path to a more sustainable home.',
      'solar.intro2': 'At <strong class="brand-text">Home Service HLG</strong> we help you take the first step. We specialize in:',
      'solar.item1': 'System sizing calculations, making sure your installation fits your specific energy needs.',
      'solar.item2': 'Custom-built mounting structures for solar panels, made to measure for your home or business.',
      'solar.item3': 'Setup and installation of solar systems, ensuring optimal, efficient performance that saves energy and money in the long run.',
      'solar.item4': 'We turn the sun’s energy into a source of savings and sustainability, with solutions that are both affordable and eco-friendly.',
      'solar.note': 'Discover your solar potential today: the initial consultation is free of charge.',
      'solar.badge': 'Free initial consultation',
      'solar.t1': 'System sizing',
      'solar.t2': 'Custom mounts',
      'solar.t3': 'Installation and setup',
      'solar.t4': 'Savings and sustainability',
      'solar.alt1': 'Installed solar panels',
      'solar.alt2': 'Solar installation detail',
      'solar.alt3': 'Residential solar system',

      'metal.title': 'Custom-made metal structures',
      'metal.p1': 'We design and build metal structures and roofing, delivering solid, durable and well-designed solutions tailored to each client’s needs.',
      'metal.t1': 'We support you at every stage',
      'metal.p2': 'We listen, plan and execute with precision and efficiency, on competitive timelines and without compromising quality.',
      'metal.t2': 'Technical precision',
      'metal.p3': 'We master modern welding and assembly processes to build rigid, stable structures, from residential roofing to more complex projects.',
      'metal.cta': 'Request a quote',
      'metal.p4': 'At Home Service HLG we don’t just build structures: we build trust, safety and well-being.',
      'metal.prev': 'Previous image',
      'metal.next': 'Next image',
      'metal.slide': 'Metal structure project',

      'lb.label': 'Project photo',
      'lb.close': 'Close',
      'lb.prev': 'Previous photo',
      'lb.next': 'Next photo',
      'gallery.title': 'Our gallery',
      'gallery.subtitle': 'A selection of our recent work.',
      'gallery.img001': 'Metal structure under construction',
      'gallery.img002': 'Roof frame structure',
      'gallery.img003': 'Hybrid inverter and protections',
      'gallery.img004': 'Rooftop solar panels',
      'gallery.img005': 'Water heater and pump',
      'gallery.img006': 'Electrical protection panel',
      'gallery.img007': 'Panels on a custom metal mount',
      'gallery.img008': 'Structure welding',
      'gallery.img009': 'Metal sheet gate',
      'gallery.img010': 'Metal roofing',
      'gallery.img011': 'Metal shed',
      'gallery.img012': 'Metal frame over a wall',

      'contact.title': 'Contact us',
      'contact.text': 'We are available to help you with your project.',
      'footer.tagline': 'We build your future with steel and solar energy.',
      'footer.nav': 'Navigation',
      'contact.fb': 'Follow us',
      'footer.rights': 'All rights reserved'
    }
  };

  const safeGet = (key) => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) { /* almacenamiento no disponible */ }
  };

  function detectLang() {
    const stored = safeGet(LANG_KEY);
    if (SUPPORTED.includes(stored)) return stored;
    return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  function detectTheme() {
    const stored = safeGet(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  let currentLang = detectLang();

  function t(key) {
    return (dictionary[currentLang] && dictionary[currentLang][key]) || dictionary.es[key] || key;
  }

  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    scope.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    scope.querySelectorAll('[data-i18n-alt]').forEach((el) => { el.setAttribute('alt', t(el.dataset.i18nAlt)); });
    scope.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    scope.querySelectorAll('[data-i18n-title]').forEach((el) => { el.setAttribute('title', t(el.dataset.i18nTitle)); });
  }

  function applyPage() {
    document.documentElement.lang = currentLang;
    document.title = t('meta.title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.description'));
    apply(document);
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === currentLang) return;
    currentLang = lang;
    safeSet(LANG_KEY, lang);
    applyPage();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function paintTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f1412' : '#3f7d5c');
  }

  // Elección manual del usuario: se persiste.
  function setTheme(theme) {
    paintTheme(theme);
    safeSet(THEME_KEY, theme);
  }

  // Aplicar el tema lo antes posible para evitar parpadeo.
  document.documentElement.setAttribute('data-bs-theme', detectTheme());

  window.I18n = { t, apply, setLang, getLang: () => currentLang };

  document.addEventListener('DOMContentLoaded', () => {
    applyPage();
    paintTheme(document.documentElement.getAttribute('data-bs-theme'));

    document.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    }

    // Seguir el tema del sistema mientras el usuario no haya elegido uno manualmente.
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!safeGet(THEME_KEY)) {
          paintTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  });
})();
