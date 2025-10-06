import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <header className="main-header">
        <div className="header-content">
          <div className="header-logo">
            <img src="/image/logo.png" alt="Logo" className="logo-image" />
          </div>
          <h1>Sistema de Asistencia Vehicular</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <h2>Bienvenido al Sistema de Asistencia</h2>
          <p>Este sistema permite registrar y dar seguimiento a siniestros de manera rápida y segura.</p>

          <div className="benefits">
            <div className="benefit">
              <img src="/image/Checkmark.png" alt="Rápida" className="benefit-icon" />
              <span>Rápida atención</span>
            </div>
            <div className="benefit">
              <img src="/image/Chile.png" alt="Nacional" className="benefit-icon" />
              <span>Cobertura nacional</span>
            </div>
            <div className="benefit">
              <img src="/image/clock.png" alt="24/7" className="benefit-icon" />
              <span>24/7</span>
            </div>
          </div>

          <div className="btn-group">
            <Link to="/login" className="btn btn-primary">
              <img src="/image/folder.png" alt="Registrar" className="btn-icon" />
              Registrar siniestro
            </Link>
            <Link to="/login" className="btn btn-secondary">
              <img src="/image/list.png" alt="Consultar" className="btn-icon" />
              Consultar estado
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
