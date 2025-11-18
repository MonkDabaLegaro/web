// Servicio de siniestros usando ApiBase

import ApiBase from './apiBase.js';

class SiniestroService extends ApiBase {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL);
  }

  // Crear nuevo siniestro
  async crearSiniestro(datos) {
    const result = await this.makeRequest('/siniestros', {
      method: 'POST',
      body: JSON.stringify(datos),
    });

    return result;
  }

  // Buscar siniestros por criterios
  async buscarSiniestros(criterios) {
    const queryParams = new URLSearchParams();
    
    if (criterios.rut) queryParams.append('rut', criterios.rut);
    if (criterios.poliza) queryParams.append('poliza', criterios.poliza);
    if (criterios.estado) queryParams.append('estado', criterios.estado);
    if (criterios.tipo) queryParams.append('tipo', criterios.tipo);

    const result = await this.makeRequest(`/siniestros/buscar?${queryParams}`, {
      method: 'GET',
    });

    return result.success ? result.data : [];
  }

  // Obtener siniestro por ID
  async obtenerSiniestro(id) {
    const result = await this.makeRequest(`/siniestros/${id}`, {
      method: 'GET',
    });

    return result.success ? result.data : null;
  }

  // Actualizar estado de siniestro
  async actualizarEstado(id, nuevoEstado) {
    const result = await this.makeRequest(`/siniestros/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ nuevoEstado }),
    });

    return result;
  }

  // Obtener estadísticas generales
  async getEstadisticas() {
    const result = await this.makeRequest('/siniestros/estadisticas', {
      method: 'GET',
    });

    return result.success ? result.data : {};
  }

  // Obtener estadísticas por tipo
  async getEstadisticasPorTipo() {
    const result = await this.makeRequest('/siniestros/estadisticas/tipo', {
      method: 'GET',
    });

    return result.success ? result.data : {};
  }

  // Obtener estadísticas por liquidador
  async getEstadisticasPorLiquidador() {
    const result = await this.makeRequest('/siniestros/estadisticas/liquidador', {
      method: 'GET',
    });

    return result.success ? result.data : {};
  }

  // Obtener siniestros recientes
  async getSiniestrosRecientes(limite = 5) {
    const result = await this.makeRequest(`/siniestros/recientes?limite=${limite}`, {
      method: 'GET',
    });

    return result.success ? result.data : [];
  }

  // Obtener todos los siniestros
  async getAllSiniestros() {
    const result = await this.makeRequest('/siniestros', {
      method: 'GET',
    });

    return result.success ? result.data : [];
  }
}

export const siniestroService = new SiniestroService();
