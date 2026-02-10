// Sistema de autenticación para admin
class AuthSystem {
  constructor() {
    this.SESSION_KEY = 'admin_session';
    this.USERS_KEY = 'admin_users';
    this.SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
    this.initialized = false;
    this.initPromise = this.initializeDefaultUser();
  }
  
  // Asegurar que esté inicializado
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initPromise;
      this.initialized = true;
    }
  }

  // Inicializar usuario admin por defecto
  async initializeDefaultUser() {
    const users = this.getUsers();
    if (!users || users.length === 0) {
      const passwordHash = await this.hashPassword('admin123');
      const defaultUser = {
        username: 'admin',
        passwordHash: passwordHash,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(this.USERS_KEY, JSON.stringify([defaultUser]));
    }
  }

  // Hash simple con SHA-256
  async hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Obtener usuarios
  getUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Login
  async login(username, password) {
    await this.ensureInitialized();
    
    const users = this.getUsers();
    const passwordHash = await this.hashPassword(password);
    
    const user = users.find(u => u.username === username && u.passwordHash === passwordHash);
    
    if (user) {
      const session = {
        username: user.username,
        token: this.generateToken(),
        expiresAt: Date.now() + this.SESSION_DURATION,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return { success: true, user: { username: user.username } };
    }
    
    return { success: false, message: 'Usuario o contraseña incorrectos' };
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
    const users = this.getUsers();
    const oldPasswordHash = await this.hashPassword(oldPassword);
    const userIndex = users.findIndex(u => u.username === username && u.passwordHash === oldPasswordHash);
    
    if (userIndex === -1) {
      return { success: false, message: 'Contraseña actual incorrecta' };
    }
    
    users[userIndex].passwordHash = await this.hashPassword(newPassword);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    return { success: true, message: 'Contraseña actualizada correctamente' };
  }
}

// Instancia global
const authSystem = new AuthSystem();
