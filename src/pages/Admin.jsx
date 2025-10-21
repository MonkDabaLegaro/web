import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { siniestroManager } from '../services/siniestroService';

export default function Admin() {
  // Obtener datos reales del sistema
  const stats = useMemo(() => siniestroManager.getEstadisticas(), []);
  const completadosHoy = useMemo(() => siniestroManager.getSiniestrosCompletadosHoy(), []);
  const gruasStats = useMemo(() => siniestroManager.getEstadisticasGruas(), []);
  const talleresStats = useMemo(() => siniestroManager.getEstadisticasTalleres(), []);
  const actividadReciente = useMemo(() => siniestroManager.getActividadReciente(), []);
  return (
    <>
      <Header title="Panel Administrador" />
      <Navigation />

      <main className="admin-main">
        <div className="welcome-section">
          <h2>Bienvenido al Sistema de Gestión de Siniestros</h2>
          <p>Desde este panel puedes gestionar todos los aspectos del sistema de asistencia vehicular.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <img src="/src/image/folder.png" alt="Activos" />
            </div>
            <div className="stat-content">
              <h3>Siniestros Activos</h3>
              <p className="stat-number">{stats.activos}</p>
              <small>En proceso</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/src/image/Checkmark.png" alt="Completados" />
            </div>
            <div className="stat-content">
              <h3>Completados Hoy</h3>
              <p className="stat-number">{completadosHoy}</p>
              <small>Finalizados</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/src/image/YellowCheckMark.png" alt="Grúas" />
            </div>
            <div className="stat-content">
              <h3>Grúas Disponibles</h3>
              <p className="stat-number">{gruasStats.disponibles}</p>
              <small>En servicio</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/src/image/list.png" alt="Talleres" />
            </div>
            <div className="stat-content">
              <h3>Talleres Activos</h3>
              <p className="stat-number">{talleresStats.operativos}</p>
              <small>Operativos</small>
            </div>
          </div>
        </div>


        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            {actividadReciente.length > 0 ? (
              actividadReciente.map((actividad) => (
                <div key={actividad.id} className="activity-item">
                  <img src={actividad.icono} alt={actividad.tipo} className="activity-icon" />
                  <div className="activity-content">
                    <p><strong>{actividad.tipo}</strong></p>
                    <small>{actividad.descripcion}</small>
                    <span className="activity-time">{actividad.tiempo}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <img src="/src/image/clock.png" alt="Sin actividad" className="activity-icon" />
                <div className="activity-content">
                  <p><strong>Sin actividad reciente</strong></p>
                  <small>No hay siniestros registrados aún</small>
                  <span className="activity-time">-</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
