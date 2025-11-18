import { useNavigate } from 'react-router-dom';
import { logout, getUserType } from '../utils/auth';

export default function Header({ title }) {
  const navigate = useNavigate();
  const userType = getUserType();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserLabel = () => {
    return userType === 'admin' ? 'Administrador' : 'Cliente';
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-logo">
          <img src="/image/logo.png" alt="Logo" className="logo-image" />
        </div>
        <h1>{title || 'Sistema de Asistencia Vehicular'}</h1>
        {userType && (
          <div className="user-info">
            <span>Bienvenido, <strong>{getUserLabel()}</strong></span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
