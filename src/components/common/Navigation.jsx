import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserType } from '../../utils/auth';

const Navigation = () => {
  const location = useLocation();
  const userType = getUserType();

  const navItems = userType === 'admin' ? [
    { key: 'admin', label: 'Inicio', path: '/admin' },
    { key: 'ingreso', label: 'Ingreso de Siniestro', path: '/ingreso' },
    { key: 'consulta', label: 'Consulta de Estado', path: '/consulta' },
    { key: 'reporte', label: 'Reportes', path: '/reporte' }
  ] : [
    { key: 'cliente', label: 'Inicio', path: '/cliente' },
    { key: 'ingreso', label: 'Ingreso de Siniestro', path: '/ingreso' },
    { key: 'consulta', label: 'Consulta de Estado', path: '/consulta' }
  ];

  return (
    <nav className="main-nav">
      <ul>
        {navItems.map((item) => (
          <li key={item.key}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;