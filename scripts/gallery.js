// Sistema de galería pública para la página principal
class PublicGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.storage = new GalleryStorage();
  }

  // Renderizar galería
  render() {
    if (!this.container) return;

    const images = this.storage.getImages();
    
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
          <img src="${image.data}" alt="${this.escapeHtml(image.title)}" class="gallery-image">
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
    const gallery = new PublicGallery('gallery-container');
    gallery.render();
  }
});
