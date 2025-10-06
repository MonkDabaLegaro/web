import { Link } from 'react-router-dom';
import logo from '../image/logo.png';
import checkmark from '../image/Checkmark.png';
import chile from '../image/Chile.png';
import clock from '../image/clock.png';
import folder from '../image/folder.png';
import list from '../image/list.png';

export default function Home() {
  return (
    <>
      <header className="main-header">
        <div className="header-content">
          <div className="header-logo">
            <img src={logo} alt="Logo" className="logo-image" />
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
              <img src={checkmark} alt="Rápida" className="benefit-icon" />
              <span>Rápida atención</span>
            </div>
            <div className="benefit">
              <img src={chile} alt="Nacional" className="benefit-icon" />
              <span>Cobertura nacional</span>
            </div>
            <div className="benefit">
              <img src={clock} alt="24/7" className="benefit-icon" />
              <span>24/7</span>
            </div>
          </div>

          <div className="btn-group">
            <Link to="/login" className="btn btn-primary">
              <img src={folder} alt="Registrar" className="btn-icon" />
              Registrar siniestro
            </Link>
            <Link to="/login" className="btn btn-secondary">
              <img src={list} alt="Consultar" className="btn-icon" />
              Consultar estado
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
