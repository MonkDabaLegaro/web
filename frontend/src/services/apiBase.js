class ApiBase {
  constructor(baseUrl) {
    this.apiUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async makeRequest(endpoint, options = {}, includeAuth = true) {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(includeAuth),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `Error HTTP: ${response.status}`;
        throw new Error(errorMessage);
      }

      return { success: true, data };
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      return { success: false, error: error.message };
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  getUserType() {
    return this.user?.userType;
  }

  getUser() {
    return this.user;
  }
}

export default ApiBase;