// Sistema de almacenamiento para galería
class GalleryStorage {
  constructor() {
    this.GALLERY_KEY = 'gallery_images';
    this.MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB por imagen
    this.ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  }

  // Obtener todas las imágenes
  getImages() {
    const images = localStorage.getItem(this.GALLERY_KEY);
    return images ? JSON.parse(images) : [];
  }

  // Guardar imágenes
  saveImages(images) {
    try {
      localStorage.setItem(this.GALLERY_KEY, JSON.stringify(images));
      return { success: true };
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        return { success: false, message: 'Espacio de almacenamiento lleno. Elimina algunas imágenes.' };
      }
      return { success: false, message: 'Error al guardar: ' + e.message };
    }
  }

  // Agregar imagen
  async addImage(file, title, description) {
    // Validar tipo
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { success: false, message: 'Tipo de archivo no permitido. Usa JPG, PNG, GIF o WebP.' };
    }

    // Validar tamaño
    if (file.size > this.MAX_IMAGE_SIZE) {
      return { success: false, message: 'La imagen es demasiado grande. Máximo 2MB.' };
    }

    try {
      const base64 = await this.fileToBase64(file);
      const images = this.getImages();
      
      const newImage = {
        id: this.generateId(),
        title: title || 'Sin título',
        description: description || '',
        data: base64,
        type: file.type,
        size: file.size,
        createdAt: new Date().toISOString()
      };

      images.push(newImage);
      const result = this.saveImages(images);
      
      if (result.success) {
        return { success: true, image: newImage };
      }
      return result;
    } catch (e) {
      return { success: false, message: 'Error al procesar imagen: ' + e.message };
    }
  }

  // Actualizar imagen
  updateImage(id, updates) {
    const images = this.getImages();
    const index = images.findIndex(img => img.id === id);
    
    if (index === -1) {
      return { success: false, message: 'Imagen no encontrada' };
    }

    images[index] = { ...images[index], ...updates, updatedAt: new Date().toISOString() };
    return this.saveImages(images);
  }

  // Eliminar imagen
  deleteImage(id) {
    const images = this.getImages();
    const filtered = images.filter(img => img.id !== id);
    
    if (filtered.length === images.length) {
      return { success: false, message: 'Imagen no encontrada' };
    }

    return this.saveImages(filtered);
  }

  // Obtener imagen por ID
  getImageById(id) {
    const images = this.getImages();
    return images.find(img => img.id === id);
  }

  // Convertir archivo a Base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Obtener estadísticas de almacenamiento
  getStorageStats() {
    const images = this.getImages();
    const totalSize = images.reduce((sum, img) => sum + (img.size || 0), 0);
    
    return {
      count: images.length,
      totalSize: totalSize,
      totalSizeFormatted: this.formatBytes(totalSize)
    };
  }

  // Formatear bytes
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Instancia global
const galleryStorage = new GalleryStorage();
