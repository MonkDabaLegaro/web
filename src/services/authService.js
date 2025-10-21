class AuthService {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api';
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Método para obtener headers con autenticación
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Iniciar sesión
  async login(username, password) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y datos del usuario
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, user: data.user, token: data.token };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, error: error.message };
    }
  }

  // Cerrar sesión
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Obtener tipo de usuario
  getUserType() {
    return this.user?.userType;
  }

  // Obtener datos del usuario
  getUser() {
    return this.user;
  }

  // Verificar token con el servidor
  async verifyToken() {
    try {
      if (!this.token) {
        return { valid: false };
      }

      const response = await fetch(`${this.apiUrl}/auth/verify`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        this.logout();
        return { valid: false };
      }

      // Actualizar datos del usuario
      this.user = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));

      return { valid: true, user: data.user };
    } catch (error) {
      console.error('Error al verificar token:', error);
      this.logout();
      return { valid: false };
    }
  }

  // Crear usuarios por defecto (solo para desarrollo)
  async createDefaultUsers() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/create-default-users`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear usuarios por defecto');
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error al crear usuarios por defecto:', error);
      return { success: false, error: error.message };
    }
  }
}

export const authService = new AuthService();
