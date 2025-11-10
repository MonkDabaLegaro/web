import React from 'react';
// Removed image import - using URL path instead

const Header = () => {
  const handleLogout = () => {
    // Logout logic
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-logo">
          <img 
            src="/image/logo.png"  // ← Uses URL path
            alt="Logo" 
            className="logo-image"
          />
          <h1>Sistema de Asistencia Vehicular</h1>
        </div>
        <div className="user-info">
          <span>Bienvenido, <strong>Usuario</strong></span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
