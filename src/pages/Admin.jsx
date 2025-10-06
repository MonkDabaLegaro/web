import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default function Admin() {
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
              <p className="stat-number">24</p>
              <small>En proceso</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/image/Checkmark.png" alt="Completados" />
            </div>
            <div className="stat-content">
              <h3>Completados Hoy</h3>
              <p className="stat-number">8</p>
              <small>Finalizados</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/image/YellowCheckMark.png" alt="Grúas" />
            </div>
            <div className="stat-content">
              <h3>Grúas Disponibles</h3>
              <p className="stat-number">12</p>
              <small>En servicio</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src="/image/list.png" alt="Talleres" />
            </div>
            <div className="stat-content">
              <h3>Talleres Activos</h3>
              <p className="stat-number">6</p>
              <small>Operativos</small>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Acciones Rápidas</h3>
          <div className="action-buttons">
            <Link to="/ingreso" className="action-btn">
              <img src="/image/folder.png" alt="Nuevo" className="action-icon" />
              <span>Nuevo Siniestro</span>
            </Link>
            <Link to="/consulta" className="action-btn">
              <img src="/image/list.png" alt="Consultar" className="action-icon" />
              <span>Consultar Estado</span>
            </Link>
            <Link to="/reporte" className="action-btn">
              <img src="/image/Checkmark.png" alt="Reportes" className="action-icon" />
              <span>Ver Reportes</span>
            </Link>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <img src="/image/folder.png" alt="Nuevo" className="activity-icon" />
              <div className="activity-content">
                <p><strong>Nuevo siniestro registrado</strong></p>
                <small>RUT: 12.345.678-9 - Póliza: POL123</small>
                <span className="activity-time">Hace 15 minutos</span>
              </div>
            </div>
            <div className="activity-item">
              <img src="/image/list.png" alt="Proceso" className="activity-icon" />
              <div className="activity-content">
                <p><strong>Siniestro en evaluación</strong></p>
                <small>Asignado a liquidador María González</small>
                <span className="activity-time">Hace 1 hora</span>
              </div>
            </div>
            <div className="activity-item">
              <img src="/image/Checkmark.png" alt="Completado" className="activity-icon" />
              <div className="activity-content">
                <p><strong>Siniestro finalizado</strong></p>
                <small>Vehículo entregado al cliente</small>
                <span className="activity-time">Hace 2 horas</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
