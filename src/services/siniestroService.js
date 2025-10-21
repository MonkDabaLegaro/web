class SiniestroManager {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api';
    this.token = localStorage.getItem('authToken');
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

  // Actualizar token cuando el usuario se autentica
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Limpiar token cuando el usuario se desautentica
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async crearSiniestro(datos) {
    try {
      const response = await fetch(`${this.apiUrl}/siniestros`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear siniestro');
      }

      const nuevoSiniestro = await response.json();
      return nuevoSiniestro;
    } catch (error) {
      console.error('Error al crear siniestro:', error);
      throw error;
    }
  }

  async buscarSiniestros(criterios) {
    try {
      const queryParams = new URLSearchParams();
      
      if (criterios.rut) queryParams.append('rut', criterios.rut);
      if (criterios.poliza) queryParams.append('poliza', criterios.poliza);
      if (criterios.estado) queryParams.append('estado', criterios.estado);
      if (criterios.tipo) queryParams.append('tipo', criterios.tipo);

      const response = await fetch(`${this.apiUrl}/siniestros/buscar?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al buscar siniestros');
      }

      const resultados = await response.json();
      return resultados;
    } catch (error) {
      console.error('Error al buscar siniestros:', error);
      throw error;
    }
  }

  async obtenerSiniestro(id) {
    try {
      const response = await fetch(`${this.apiUrl}/siniestros/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener siniestro');
      }

      const siniestro = await response.json();
      return siniestro;
    } catch (error) {
      console.error('Error al obtener siniestro:', error);
      throw error;
    }
  }

  asignarLiquidador() {
    const liquidadores = [
      'María González',
      'Carlos López',
      'Ana Silva',
      'Pedro Martínez',
      'Luis Rodríguez',
      'Carmen Morales'
    ];
    return liquidadores[Math.floor(Math.random() * liquidadores.length)];
  }

  asignarGrua() {
    const gruas = [
      'Grúa Express Norte',
      'Grúa Rápida Sur',
      'Grúa Central 24/7',
      'Grúa Metropolitana',
      'Grúa Oriente'
    ];
    return gruas[Math.floor(Math.random() * gruas.length)];
  }

  asignarTaller() {
    const talleres = [
      'Taller Mecánico ABC',
      'Taller Automotriz Pro',
      'Taller Central Motors',
      'Taller Sur Especializado',
      'Taller Norte Premium'
    ];
    return talleres[Math.floor(Math.random() * talleres.length)];
  }

  async actualizarEstado(id, nuevoEstado) {
    try {
      const response = await fetch(`${this.apiUrl}/siniestros/${id}/estado`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ nuevoEstado })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar estado');
      }

      const siniestroActualizado = await response.json();
      return siniestroActualizado;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }

  async getEstadisticas() {
    try {
      const response = await fetch(`${this.apiUrl}/siniestros/estadisticas`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener estadísticas');
      }

      const estadisticas = await response.json();
      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  async getEstadisticasPorTipo() {
    try {
      const response = await fetch(`${this.apiUrl}/siniestros/estadisticas/tipo`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener estadísticas por tipo');
      }

      const estadisticas = await response.json();
      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas por tipo:', error);
      throw error;
    }
  }

  async getEstadisticasPorLiquidador() {
    try {
      const response = await fetch(`${this.apiUrl}/siniestros/estadisticas/liquidador`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener estadísticas por liquidador');
      }

      const estadisticas = await response.json();
      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas por liquidador:', error);
      throw error;
    }
  }

  async getSiniestrosRecientes(limite = 5) {
    try {
      const response = await fetch(`${this.apiUrl}/siniestros/recientes?limite=${limite}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener siniestros recientes');
      }

      const siniestros = await response.json();
      return siniestros;
    } catch (error) {
      console.error('Error al obtener siniestros recientes:', error);
      throw error;
    }
  }

  // Método para obtener todos los siniestros (para debug)
  async getAllSiniestros() {
    try {
      const response = await fetch(`${this.apiUrl}/siniestros`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener todos los siniestros');
      }

      const siniestros = await response.json();
      console.log('=== TODOS LOS SINIESTROS ===');
      siniestros.forEach(s => {
        console.log(`ID: ${s._id}, RUT: ${s.rut}, Poliza: ${s.numeroPoliza}, Estado: ${s.estado}`);
      });
      return siniestros;
    } catch (error) {
      console.error('Error al obtener todos los siniestros:', error);
      throw error;
    }
  }
}

export const siniestroManager = new SiniestroManager();
