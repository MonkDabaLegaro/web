import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUsername } from '../../utils/auth';
import logo from '../../image/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const username = getUsername() || 'Usuario';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-logo">
          <img 
            src={logo}  // ← Usa la variable importada
            alt="Logo" 
            className="logo-image"
          />
          <h1>Sistema de Asistencia Vehicular</h1>
        </div>
        <div className="user-info">
          <span>Bienvenido, <strong>{username}</strong></span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
