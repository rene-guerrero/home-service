// Sistema de almacenamiento usando GitHub
class GalleryStorageGitHub {
  constructor() {
    this.GALLERY_JSON_URL = 'data/gallery.json';
    this.GITHUB_API = 'https://api.github.com';
    this.MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    this.ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    // Configuración de GitHub (se obtiene de localStorage)
    this.config = this.getGitHubConfig();
  }

  // Obtener configuración de GitHub
  getGitHubConfig() {
    const config = localStorage.getItem('github_config');
    if (!config) {
      return {
        owner: '',
        repo: '',
        token: '',
        branch: 'main'
      };
    }
    return JSON.parse(config);
  }

  // Guardar configuración de GitHub
  saveGitHubConfig(owner, repo, token, branch = 'main') {
    const config = { owner, repo, token, branch };
    localStorage.setItem('github_config', JSON.stringify(config));
    this.config = config;
    return { success: true };
  }

  // Verificar si está configurado
  isConfigured() {
    return !!(this.config.owner && this.config.repo && this.config.token);
  }

  // Obtener token de autenticación
  getAuthToken() {
    const session = localStorage.getItem('admin_session');
    if (!session) return null;
    const sessionData = JSON.parse(session);
    return sessionData.token;
  }

  // Obtener todas las imágenes desde gallery.json
  async getImages() {
    try {
      // Primero intentar cargar desde el archivo local (después del build)
      const response = await fetch(`/${this.GALLERY_JSON_URL}?t=${Date.now()}`);
      
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.images || [];
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
      return [];
    }
  }

  // Agregar imagen
  async addImage(file, title, description) {
    if (!this.isConfigured()) {
      return { 
        success: false, 
        message: 'GitHub no está configurado. Ve a Configuración.' 
      };
    }

    // Validar tipo
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { 
        success: false, 
        message: 'Tipo de archivo no permitido. Usa JPG, PNG, GIF o WebP.' 
      };
    }

    // Validar tamaño
    if (file.size > this.MAX_IMAGE_SIZE) {
      return { 
        success: false, 
        message: 'La imagen es demasiado grande. Máximo 5MB.' 
      };
    }

    try {
      // 1. Convertir imagen a base64
      const base64Content = await this.fileToBase64(file);
      const base64Data = base64Content.split(',')[1]; // Quitar el prefijo data:image/...

      // 2. Generar nombre único
      const id = this.generateId();
      const ext = file.name.split('.').pop();
      const filename = `${id}.${ext}`;
      const filePath = `pictures/${filename}`;

      // 3. Subir imagen a GitHub
      const uploadResult = await this.uploadToGitHub(
        filePath,
        base64Data,
        `Add image: ${title}`
      );

      if (!uploadResult.success) {
        return uploadResult;
      }

      // 4. Actualizar gallery.json
      const images = await this.getImages();
      const newImage = {
        id,
        filename,
        title: title || 'Sin título',
        description: description || '',
        size: file.size,
        path: filePath,
        url: `pictures/${filename}`,
        uploadedAt: new Date().toISOString()
      };

      images.push(newImage);

      const updateResult = await this.updateGalleryJson(images);
      
      if (!updateResult.success) {
        return updateResult;
      }

      return { success: true, image: newImage };

    } catch (error) {
      console.error('Error al agregar imagen:', error);
      return { 
        success: false, 
        message: 'Error al subir imagen: ' + error.message 
      };
    }
  }

  // Subir archivo a GitHub
  async uploadToGitHub(path, content, message) {
    try {
      const url = `${this.GITHUB_API}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;
      
      // Verificar si el archivo ya existe
      let sha = null;
      try {
        const checkResponse = await fetch(url, {
          headers: {
            'Authorization': `token ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (checkResponse.ok) {
          const existingFile = await checkResponse.json();
          sha = existingFile.sha;
        }
      } catch (e) {
        // El archivo no existe, está bien
      }

      // Subir o actualizar archivo
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          content,
          branch: this.config.branch,
          ...(sha && { sha })
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al subir a GitHub');
      }

      return { success: true };

    } catch (error) {
      console.error('Error al subir a GitHub:', error);
      return { 
        success: false, 
        message: 'Error de GitHub: ' + error.message 
      };
    }
  }

  // Actualizar gallery.json en GitHub
  async updateGalleryJson(images) {
    try {
      const galleryData = {
        images,
        lastUpdated: new Date().toISOString()
      };

      const content = JSON.stringify(galleryData, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(content)));

      return await this.uploadToGitHub(
        this.GALLERY_JSON_URL,
        base64Content,
        'Update gallery metadata'
      );

    } catch (error) {
      console.error('Error al actualizar gallery.json:', error);
      return { 
        success: false, 
        message: 'Error al actualizar galería: ' + error.message 
      };
    }
  }

  // Actualizar imagen (solo metadata)
  async updateImage(id, updates) {
    try {
      const images = await this.getImages();
      const index = images.findIndex(img => img.id === id);
      
      if (index === -1) {
        return { success: false, message: 'Imagen no encontrada' };
      }

      images[index] = { 
        ...images[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };

      return await this.updateGalleryJson(images);

    } catch (error) {
      console.error('Error al actualizar imagen:', error);
      return { 
        success: false, 
        message: 'Error al actualizar: ' + error.message 
      };
    }
  }

  // Eliminar imagen
  async deleteImage(id) {
    if (!this.isConfigured()) {
      return { 
        success: false, 
        message: 'GitHub no está configurado' 
      };
    }

    try {
      const images = await this.getImages();
      const image = images.find(img => img.id === id);
      
      if (!image) {
        return { success: false, message: 'Imagen no encontrada' };
      }

      // 1. Eliminar archivo de imagen de GitHub
      const deleteResult = await this.deleteFromGitHub(
        image.path,
        `Delete image: ${image.title}`
      );

      if (!deleteResult.success) {
        return deleteResult;
      }

      // 2. Actualizar gallery.json
      const updatedImages = images.filter(img => img.id !== id);
      return await this.updateGalleryJson(updatedImages);

    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      return { 
        success: false, 
        message: 'Error al eliminar: ' + error.message 
      };
    }
  }

  // Eliminar archivo de GitHub
  async deleteFromGitHub(path, message) {
    try {
      const url = `${this.GITHUB_API}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;
      
      // Obtener SHA del archivo
      const getResponse = await fetch(url, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!getResponse.ok) {
        throw new Error('No se pudo obtener el archivo');
      }

      const fileData = await getResponse.json();

      // Eliminar archivo
      const deleteResponse = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          sha: fileData.sha,
          branch: this.config.branch
        })
      });

      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        throw new Error(error.message || 'Error al eliminar de GitHub');
      }

      return { success: true };

    } catch (error) {
      console.error('Error al eliminar de GitHub:', error);
      return { 
        success: false, 
        message: 'Error de GitHub: ' + error.message 
      };
    }
  }

  // Obtener imagen por ID
  async getImageById(id) {
    const images = await this.getImages();
    return images.find(img => img.id === id);
  }

  // Obtener URL de imagen
  getImageUrl(filename) {
    return `pictures/${filename}`;
  }

  // Obtener estadísticas
  async getStorageStats() {
    const images = await this.getImages();
    const totalSize = images.reduce((sum, img) => sum + (img.size || 0), 0);
    
    return {
      count: images.length,
      totalSize: totalSize,
      totalSizeFormatted: this.formatBytes(totalSize)
    };
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
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
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
const galleryStorage = new GalleryStorageGitHub();
