class SiniestroManager {
  constructor() {
    this.siniestros = this.loadSiniestros();
    this.nextId = this.getNextId();
  }

  loadSiniestros() {
    const stored = localStorage.getItem('siniestros');
    return stored ? JSON.parse(stored) : [];
  }

  saveSiniestros() {
    localStorage.setItem('siniestros', JSON.stringify(this.siniestros));
  }

  getNextId() {
    if (this.siniestros.length === 0) return 1;
    return Math.max(...this.siniestros.map(s => s.id)) + 1;
  }

  crearSiniestro(datos) {
    const nuevoSiniestro = {
      id: this.nextId++,
      ...datos,
      fechaRegistro: new Date().toISOString(),
      estado: 'Ingresado',
      liquidador: this.asignarLiquidador(),
      grua: this.asignarGrua(),
      taller: this.asignarTaller()
    };

    this.siniestros.push(nuevoSiniestro);
    this.saveSiniestros();

    return nuevoSiniestro;
  }

  buscarSiniestro(rut, poliza) {
    return this.siniestros.find(s => {
      const rutMatch = !rut || s.rut === rut;
      const polizaMatch = !poliza || s.numeroPoliza === poliza;
      return rutMatch && polizaMatch;
    });
  }

  buscarSiniestros(criterios) {
    return this.siniestros.filter(s => {
      const rutMatch = !criterios.rut || s.rut.includes(criterios.rut);
      const polizaMatch = !criterios.poliza || s.numeroPoliza.includes(criterios.poliza);
      const estadoMatch = !criterios.estado || s.estado === criterios.estado;
      const tipoMatch = !criterios.tipo || s.tipoSeguro === criterios.tipo;

      return rutMatch && polizaMatch && estadoMatch && tipoMatch;
    });
  }

  obtenerSiniestro(id) {
    return this.siniestros.find(s => s.id === id);
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

  actualizarEstado(id, nuevoEstado) {
    const siniestro = this.siniestros.find(s => s.id === id);
    if (siniestro) {
      siniestro.estado = nuevoEstado;
      siniestro.fechaActualizacion = new Date().toISOString();
      this.saveSiniestros();
      return true;
    }
    return false;
  }

  getEstadisticas() {
    const total = this.siniestros.length;
    const activos = this.siniestros.filter(s => s.estado !== 'Finalizado').length;
    const finalizados = this.siniestros.filter(s => s.estado === 'Finalizado').length;
    const enEvaluacion = this.siniestros.filter(s => s.estado === 'En Evaluación').length;
    const ingresados = this.siniestros.filter(s => s.estado === 'Ingresado').length;

    return {
      total,
      activos,
      finalizados,
      enEvaluacion,
      ingresados
    };
  }

  getEstadisticasPorTipo() {
    const tipos = {};
    this.siniestros.forEach(s => {
      tipos[s.tipoSeguro] = (tipos[s.tipoSeguro] || 0) + 1;
    });
    return tipos;
  }

  getEstadisticasPorLiquidador() {
    const liquidadores = {};

    this.siniestros.forEach(s => {
      if (!liquidadores[s.liquidador]) {
        liquidadores[s.liquidador] = {
          total: 0,
          activos: 0,
          finalizados: 0,
          enEvaluacion: 0,
          ingresados: 0
        };
      }

      liquidadores[s.liquidador].total++;

      switch(s.estado) {
        case 'Finalizado':
          liquidadores[s.liquidador].finalizados++;
          break;
        case 'En Evaluación':
          liquidadores[s.liquidador].enEvaluacion++;
          break;
        case 'Ingresado':
          liquidadores[s.liquidador].ingresados++;
          break;
        default:
          liquidadores[s.liquidador].activos++;
      }
    });

    return liquidadores;
  }

  getSiniestrosRecientes(limite = 5) {
    return this.siniestros
      .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
      .slice(0, limite);
  }
}

export const siniestroManager = new SiniestroManager();
