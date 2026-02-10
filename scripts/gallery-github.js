// Sistema de galería pública para la página principal usando GitHub
class PublicGalleryGitHub {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.GALLERY_JSON_URL = 'data/gallery.json';
  }

  // Obtener imágenes desde gallery.json
  async getImages() {
    try {
      const response = await fetch(`/${this.GALLERY_JSON_URL}?t=${Date.now()}`);
      
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.images || [];
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
        <div class="gallery-item">
          <img src="${image.url || image.path}" 
               alt="${this.escapeHtml(image.title)}" 
               class="gallery-image"
               loading="lazy">
          <div class="gallery-overlay">
            <h5 class="gallery-title">${this.escapeHtml(image.title)}</h5>
            ${image.description ? `<p class="gallery-description">${this.escapeHtml(image.description)}</p>` : ''}
          </div>
        </div>
      </div>
    `).join('');
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
    const gallery = new PublicGalleryGitHub('gallery-container');
    gallery.render();
  }
});
