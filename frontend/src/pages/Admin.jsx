import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { useSiniestrosStats } from '../hooks/useSiniestrosStats';

export default function Admin() {
  const { siniestros, loading } = useSiniestrosStats();
  const [stats, setStats] = useState({
    activos: 0,
    completados: 0,
    total: 0
  });

  useEffect(() => {
    // Calcular estadísticas básicas
    const estadisticas = {
      activos: siniestros.filter(s => s.estado !== 'Finalizado').length,
      completados: siniestros.filter(s => s.estado === 'Finalizado').length,
      total: siniestros.length
    };

    setStats(estadisticas);
  }, [siniestros]);

  const obtenerActividadReciente = () => {
    if (siniestros.length === 0) {
      return [{
        id: 1,
        tipo: 'Sin actividad',
        descripcion: 'No hay siniestros registrados aún',
        tiempo: '-',
        icono: '/image/clock.png'
      }];
    }

    // Tomar los 5 más recientes
    return siniestros
      .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
      .slice(0, 5)
      .map((siniestro, index) => ({
        id: siniestro._id || index,
        tipo: `${siniestro.tipoDanio} - ${siniestro.patente}`,
        descripcion: `${siniestro.nombreCliente} (${siniestro.estado})`,
        tiempo: new Date(siniestro.fechaRegistro).toLocaleDateString(),
        icono: '/image/folder.png'
      }));
  };

  if (loading) {
    return (
      <>
        <Header title="Panel Administrador" />
        <Navigation />
        <main className="admin-main">
          <div className="loading">
            <h3>Cargando datos...</h3>
          </div>
        </main>
      </>
    );
  }

  const actividadReciente = obtenerActividadReciente();

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
              <img src="/image/folder.png" alt="Activos" />
            </div>
            <div className="stat-content">
              <h3>Siniestros Activos</h3>
              <p className="stat-number">{stats.activos}</p>
              <small>En proceso</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/image/Checkmark.png" alt="Completados" />
            </div>
            <div className="stat-content">
              <h3>Completados</h3>
              <p className="stat-number">{stats.completados}</p>
              <small>Finalizados</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/image/YellowCheckMark.png" alt="Total" />
            </div>
            <div className="stat-content">
              <h3>Total Siniestros</h3>
              <p className="stat-number">{stats.total}</p>
              <small>Registrados</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/image/list.png" alt="Navegación" />
            </div>
            <div className="stat-content">
              <h3>Acciones Rápidas</h3>
              <p className="stat-number">4</p>
              <small>Opciones</small>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            {actividadReciente.map((actividad) => (
              <div key={actividad.id} className="activity-item">
                <img src={actividad.icono} alt={actividad.tipo} className="activity-icon" />
                <div className="activity-content">
                  <p><strong>{actividad.tipo}</strong></p>
                  <small>{actividad.descripcion}</small>
                  <span className="activity-time">{actividad.tiempo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
