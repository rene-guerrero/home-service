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
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-2">Cargando galería...</p>
      </div>
    `;

    const images = await this.getImages();
    
    if (images.length === 0) {
      this.container.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted">No hay imágenes en la galería aún.</p>
        </div>
      `;
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

    // Inicializar GLightbox
    if (typeof GLightbox !== 'undefined') {
      const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
        zoomable: true,
        draggable: true,
        closeOnOutsideClick: true
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
