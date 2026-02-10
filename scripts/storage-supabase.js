// Sistema de almacenamiento usando Supabase
class GalleryStorageSupabase {
  constructor() {
    this.SUPABASE_URL = 'https://hewtiscwxdvodggrmigo.supabase.co';
    this.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhld3Rpc2N3eGR2b2RnZ3JtaWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2ODI5OTAsImV4cCI6MjA4NjI1ODk5MH0.zDlkbAoduycTUIiTJ9OdwNgrbiOokbvvDER_RexiR8w';
    
    this.BUCKET_NAME = 'gallery';
    this.TABLE_NAME = 'images';
    this.MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    this.ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    // Inicializar cliente de Supabase
    this.supabase = null;
    this.initSupabase();
  }

  // Inicializar cliente de Supabase
  async initSupabase() {
    // Cargar librería de Supabase desde CDN
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

  // Obtener token de autenticación del admin
  getAuthToken() {
    const session = localStorage.getItem('admin_session');
    if (!session) return null;
    const sessionData = JSON.parse(session);
    return sessionData.token;
  }

  // Verificar si está autenticado como admin
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Obtener todas las imágenes
  async getImages() {
    try {
      await this.ensureInitialized();

      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener imágenes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
      return [];
    }
  }

  // Agregar imagen
  async addImage(file, title, description) {
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
      await this.ensureInitialized();

      // 1. Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Subir archivo a Supabase Storage
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '31536000', // 1 año de cache
          upsert: false
        });

      if (uploadError) {
        console.error('Error al subir imagen:', uploadError);
        return { 
          success: false, 
          message: 'Error al subir imagen: ' + uploadError.message 
        };
      }

      // 3. Obtener URL pública
      const { data: urlData } = this.supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 4. Guardar metadata en la base de datos
      const { data: dbData, error: dbError } = await this.supabase
        .from(this.TABLE_NAME)
        .insert([
          {
            title: title || 'Sin título',
            description: description || '',
            filename: fileName,
            file_path: filePath,
            url: publicUrl,
            size: file.size,
            mime_type: file.type
          }
        ])
        .select();

      if (dbError) {
        // Si falla la BD, intentar eliminar el archivo subido
        await this.supabase.storage.from(this.BUCKET_NAME).remove([filePath]);
        
        console.error('Error al guardar metadata:', dbError);
        return { 
          success: false, 
          message: 'Error al guardar metadata: ' + dbError.message 
        };
      }

      return { 
        success: true, 
        image: dbData[0]
      };

    } catch (error) {
      console.error('Error al agregar imagen:', error);
      return { 
        success: false, 
        message: 'Error al subir imagen: ' + error.message 
      };
    }
  }

  // Actualizar imagen (solo metadata)
  async updateImage(id, updates) {
    try {
      await this.ensureInitialized();

      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .update({
          title: updates.title,
          description: updates.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error al actualizar imagen:', error);
        return { 
          success: false, 
          message: 'Error al actualizar: ' + error.message 
        };
      }

      return { success: true, image: data[0] };

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
    try {
      await this.ensureInitialized();

      // 1. Obtener información de la imagen
      const { data: imageData, error: getError } = await this.supabase
        .from(this.TABLE_NAME)
        .select('file_path')
        .eq('id', id)
        .single();

      if (getError || !imageData) {
        return { 
          success: false, 
          message: 'Imagen no encontrada' 
        };
      }

      // 2. Eliminar archivo del storage
      const { error: storageError } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .remove([imageData.file_path]);

      if (storageError) {
        console.error('Error al eliminar archivo:', storageError);
        // Continuar para eliminar de la BD de todos modos
      }

      // 3. Eliminar registro de la base de datos
      const { error: dbError } = await this.supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Error al eliminar de BD:', dbError);
        return { 
          success: false, 
          message: 'Error al eliminar: ' + dbError.message 
        };
      }

      return { success: true, message: 'Imagen eliminada correctamente' };

    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      return { 
        success: false, 
        message: 'Error al eliminar: ' + error.message 
      };
    }
  }

  // Obtener imagen por ID
  async getImageById(id) {
    try {
      await this.ensureInitialized();

      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error al obtener imagen:', error);
        return null;
      }

      return data;

    } catch (error) {
      console.error('Error al obtener imagen:', error);
      return null;
    }
  }

  // Obtener URL de imagen
  getImageUrl(url) {
    // La URL ya viene completa de Supabase
    return url;
  }

  // Obtener estadísticas de almacenamiento
  async getStorageStats() {
    const images = await this.getImages();
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

  // Verificar si Supabase está configurado correctamente
  async checkConfiguration() {
    try {
      await this.ensureInitialized();
      
      // Intentar hacer una consulta simple
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('count')
        .limit(1);

      if (error) {
        return { 
          success: false, 
          message: 'Error de configuración: ' + error.message 
        };
      }

      return { success: true, message: 'Supabase configurado correctamente' };

    } catch (error) {
      return { 
        success: false, 
        message: 'Error de configuración: ' + error.message 
      };
    }
  }
}

// Instancia global
const galleryStorage = new GalleryStorageSupabase();
