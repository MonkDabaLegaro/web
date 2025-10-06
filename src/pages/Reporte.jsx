import { useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { siniestroManager } from '../services/siniestroService';
import { formatearFechaHora } from '../utils/validators';

export default function Reporte() {
  useEffect(() => {
    const stats = siniestroManager.getEstadisticas();
    const recientes = siniestroManager.getSiniestrosRecientes();

    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-card">
          <h4>Total Siniestros</h4>
          <p class="stat-number">${stats.total}</p>
        </div>
        <div class="stat-card">
          <h4>Ingresados</h4>
          <p class="stat-number">${stats.ingresados}</p>
        </div>
        <div class="stat-card">
          <h4>En Evaluación</h4>
          <p class="stat-number">${stats.enEvaluacion}</p>
        </div>
        <div class="stat-card">
          <h4>Finalizados</h4>
          <p class="stat-number">${stats.finalizados}</p>
        </div>
        <div class="stat-card">
          <h4>Activos</h4>
          <p class="stat-number">${stats.activos}</p>
        </div>
      `;
    }

    const recientesContainer = document.getElementById('recientesContainer');
    if (recientesContainer && recientes.length > 0) {
      recientesContainer.innerHTML = recientes.map(s => `
        <div class="siniestro-item">
          <div class="siniestro-header">
            <span class="siniestro-id">ID: ${s.id}</span>
            <span class="siniestro-estado ${s.estado.toLowerCase().replace(/\s/g, '-')}">${s.estado}</span>
          </div>
          <div class="siniestro-details">
            <p><strong>RUT:</strong> ${s.rut}</p>
            <p><strong>Póliza:</strong> ${s.numeroPoliza}</p>
            <p><strong>Tipo:</strong> ${s.tipoSeguro}</p>
            <p><strong>Vehículo:</strong> ${s.vehiculo}</p>
            <p><strong>Liquidador:</strong> ${s.liquidador}</p>
            <p><strong>Fecha:</strong> ${formatearFechaHora(s.fechaRegistro)}</p>
          </div>
        </div>
      `).join('');
    } else if (recientesContainer) {
      recientesContainer.innerHTML = '<p class="no-data">No hay siniestros registrados</p>';
    }
  }, []);

  return (
    <>
      <Header title="Reportes" />
      <Navigation />

      <main className="main-content">
        <div className="report-container">
          <h1>Reportes y Estadísticas</h1>
          <p>Visualiza las estadísticas y reportes del sistema de siniestros</p>

          <div className="stats-section">
            <h2>Estadísticas Generales</h2>
            <div id="statsContainer" className="stats-grid"></div>
          </div>

          <div className="recent-section">
            <h2>Siniestros Recientes</h2>
            <div id="recientesContainer" className="siniestros-list"></div>
          </div>
        </div>
      </main>
    </>
  );
}
