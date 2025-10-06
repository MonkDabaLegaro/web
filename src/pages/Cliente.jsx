import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default function Cliente() {
  return (
    <>
      <Header title="Portal del Cliente" />
      <Navigation />

      <main className="main-content">
        <div className="welcome-section">
          <h2>Bienvenido al Sistema de Asistencia Vehicular</h2>
          <p>Consulta el estado de tu siniestro y mantente informado sobre el proceso de reparación.</p>
        </div>

        <div className="alert">
          <img src="/image/list.png" alt="Alerta" className="alert-icon" />
          <span>Demoras en taller X - Estimamos 2 días adicionales</span>
        </div>

        <div className="benefits-section">
          <h3>Nuestros Servicios</h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/image/Checkmark.png" alt="Atención Rápida" className="benefit-image" />
              </div>
              <h4>Atención Rápida</h4>
              <p>Respuesta inmediata a tu llamada de emergencia</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/image/folder.png" alt="Cobertura Nacional" className="benefit-image" />
              </div>
              <h4>Cobertura Nacional</h4>
              <p>Servicio disponible en todo el territorio nacional</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/image/list.png" alt="24/7" className="benefit-image" />
              </div>
              <h4>24/7</h4>
              <p>Disponible las 24 horas, los 7 días de la semana</p>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <h3>¿Qué necesitas hacer?</h3>
          <div className="action-cards">
            <Link to="/consulta" className="action-card">
              <img src="/image/list.png" alt="Consultar" className="action-icon" />
              <h4>Consultar Estado</h4>
              <p>Revisa el progreso de tu siniestro</p>
            </Link>
            <div className="action-card" style={{ cursor: 'pointer' }}>
              <img src="/image/folder.png" alt="Contacto" className="action-icon" />
              <h4>Contactar Soporte</h4>
              <p>Habla con nuestro equipo de atención</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Información Importante</h3>
          <div className="info-cards">
            <div className="info-card">
              <h4>Documentos Requeridos</h4>
              <ul>
                <li>Copia de la licencia de conducir</li>
                <li>Parte policial (si aplica)</li>
                <li>Fotos del vehículo</li>
              </ul>
            </div>
            <div className="info-card">
              <h4>Proceso de Atención</h4>
              <ol>
                <li>Registro del siniestro</li>
                <li>Evaluación por liquidador</li>
                <li>Reparación en taller</li>
                <li>Entrega del vehículo</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
