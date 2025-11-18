// Servicio de autenticación usando ApiBase

import ApiBase from './apiBase.js';

class AuthService extends ApiBase {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL);
  }

  // Iniciar sesión
  async login(username, password) {
    const result = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }, false);

    if (result.success) {
      this.setToken(result.data.token);
      this.user = result.data.user;
      localStorage.setItem('user', JSON.stringify(result.data.user));
      return { success: true, user: result.data.user, token: result.data.token };
    }

    return { success: false, error: result.error };
  }

  // Cerrar sesión
  logout() {
    this.clearToken();
  }

  // Verificar token con el servidor
  async verifyToken() {
    if (!this.token) {
      return { valid: false };
    }

    const result = await this.makeRequest('/auth/verify', {
      method: 'GET',
    });

    if (result.success) {
      this.user = result.data.user;
      localStorage.setItem('user', JSON.stringify(result.data.user));
      return { valid: true, user: result.data.user };
    }

    this.logout();
    return { valid: false };
  }

  // Crear usuarios por defecto (desarrollo)
  async createDefaultUsers() {
    const result = await this.makeRequest('/auth/create-default-users', {
      method: 'POST',
    });

    return result;
  }
}

export const authService = new AuthService();
