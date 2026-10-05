// Sistema de galería pública para la página principal usando Supabase
class PublicGallerySupabase {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.SUPABASE_URL = 'https://hewtiscwxdvodggrmigo.supabase.co';
    this.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhld3Rpc2N3eGR2b2RnZ3JtaWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2ODI5OTAsImV4cCI6MjA4NjI1ODk5MH0.zDlkbAoduycTUIiTJ9OdwNgrbiOokbvvDER_RexiR8w';
    this.TABLE_NAME = 'images';
    
    this.supabase = null;
    this.initSupabase();
  }

  // Inicializar cliente de Supabase
  async initSupabase() {
    if (!window.supabase) {
      await this.loadSupabaseLib();
    }
    
    this.supabase = window.supabase.createClient(
      this.SUPABASE_URL,
      this.SUPABASE_ANON_KEY
    );
  }

  // Cargar librería de Supabase
  loadSupabaseLib() {
    return new Promise((resolve, reject) => {
      if (window.supabase) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Asegurar que Supabase está inicializado
  async ensureInitialized() {
    if (!this.supabase) {
      await this.initSupabase();
    }
  }

  // Obtener imágenes públicamente
  async getImages() {
    try {
      await this.ensureInitialized();

      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar galería:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error al cargar galería:', error);
      return [];
    }
  }

  // Renderizar galería
  async render() {
    if (!this.container) return;

    // Mostrar loading
    this.container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border brand-text" role="status">
          <span class="visually-hidden" data-i18n="gallery.loading">Cargando galería…</span>
        </div>
        <p class="text-muted mt-2" data-i18n="gallery.loading">Cargando galería…</p>
      </div>
    `;

    I18n.apply(this.container);
    const images = await this.getImages();
    
    if (images.length === 0) {
      this.container.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted" data-i18n="gallery.empty">Aún no hay imágenes en la galería.</p>
        </div>
      `;
      I18n.apply(this.container);
      return;
    }

    this.container.innerHTML = images.map(image => `
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <a href="${image.url}" 
           class="glightbox gallery-item" 
           data-gallery="gallery"
           data-title="${this.escapeHtml(image.title)}"
           data-description="${this.escapeHtml(image.description || '')}">
          <img src="${image.url}" 
               alt="${this.escapeHtml(image.title)}" 
               class="gallery-image"
               loading="lazy">
          <div class="gallery-overlay">
            <div class="gallery-overlay-content">
              <i class="bi bi-zoom-in" style="font-size: 2rem;"></i>
              <h5 class="gallery-title">${this.escapeHtml(image.title)}</h5>
              ${image.description ? `<p class="gallery-description">${this.escapeHtml(image.description)}</p>` : ''}
            </div>
          </div>
        </a>
      </div>
    `).join('');

    // Inicializar GLightbox con configuración mejorada para touch
    if (typeof GLightbox !== 'undefined') {
      const lightbox = GLightbox({
        touchNavigation: true,
        touchFollowAxis: true,
        loop: true,
        autoplayVideos: false,
        zoomable: true,
        draggable: true,
        closeOnOutsideClick: true,
        moreLength: 0,
        slideEffect: 'slide',
        moreText: I18n.t('gallery.more'),
        svg: {
          close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
          next: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>',
          prev: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>'
        }
      });
      
      // Habilitar gestos de zoom con pinch en móvil
      lightbox.on('open', () => {
        const gslideMedia = document.querySelector('.gslide-media');
        if (gslideMedia) {
          gslideMedia.style.touchAction = 'pinch-zoom';
        }
      });
    }
  }

  // Escapar HTML para evitar XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const galleryContainer = document.getElementById('gallery-container');
  if (galleryContainer) {
    const gallery = new PublicGallerySupabase('gallery-container');
    gallery.render();
  }
});
