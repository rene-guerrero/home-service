// Sistema de autenticación usando Supabase
class AuthSystemSupabase {
  constructor() {
    this.SUPABASE_URL = 'https://hewtiscwxdvodggrmigo.supabase.co';
    this.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhld3Rpc2N3eGR2b2RnZ3JtaWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2ODI5OTAsImV4cCI6MjA4NjI1ODk5MH0.zDlkbAoduycTUIiTJ9OdwNgrbiOokbvvDER_RexiR8w';
    
    this.SESSION_KEY = 'admin_session';
    this.SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
    this.TABLE_NAME = 'admin_users';
    
    this.supabase = null;
    this.initialized = false;
    this.initPromise = this.initializeSupabase();
  }

  // Inicializar Supabase
  async initializeSupabase() {
    if (!window.supabase) {
      await this.loadSupabaseLib();
    }
    
    this.supabase = window.supabase.createClient(
      this.SUPABASE_URL,
      this.SUPABASE_ANON_KEY
    );
    
    this.initialized = true;
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

  // Asegurar que esté inicializado
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initPromise;
    }
  }

  // Hash de contraseña con SHA-256
  async hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Login
  async login(username, password) {
    await this.ensureInitialized();

    try {
      // Hash de la contraseña
      const passwordHash = await this.hashPassword(password);

      // Buscar usuario en Supabase
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('username', username)
        .eq('password_hash', passwordHash)
        .single();

      if (error || !data) {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }

      // Crear sesión local
      const session = {
        username: data.username,
        userId: data.id,
        token: this.generateToken(),
        expiresAt: Date.now() + this.SESSION_DURATION,
        loginAt: new Date().toISOString()
      };

      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      
      return { success: true, user: { username: data.username } };

    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error al iniciar sesión' };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Verificar si está autenticado
  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;
    
    if (Date.now() > session.expiresAt) {
      this.logout();
      return false;
    }
    
    return true;
  }

  // Obtener sesión actual
  getSession() {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }

  // Generar token aleatorio
  generateToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Cambiar contraseña
  async changePassword(username, oldPassword, newPassword) {
    await this.ensureInitialized();

    try {
      // Verificar contraseña actual
      const oldPasswordHash = await this.hashPassword(oldPassword);
      
      const { data: user, error: findError } = await this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('username', username)
        .eq('password_hash', oldPasswordHash)
        .single();

      if (findError || !user) {
        return { success: false, message: 'Contraseña actual incorrecta' };
      }

      // Actualizar contraseña
      const newPasswordHash = await this.hashPassword(newPassword);
      
      const { error: updateError } = await this.supabase
        .from(this.TABLE_NAME)
        .update({ password_hash: newPasswordHash })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error al actualizar contraseña:', updateError);
        return { success: false, message: 'Error al actualizar contraseña' };
      }

      return { success: true, message: 'Contraseña actualizada correctamente' };

    } catch (error) {
      console.error('Error en changePassword:', error);
      return { success: false, message: 'Error al cambiar contraseña' };
    }
  }

  // Verificar si un usuario existe
  async userExists(username) {
    await this.ensureInitialized();

    try {
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('username')
        .eq('username', username)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
}

// Instancia global
const authSystem = new AuthSystemSupabase();
