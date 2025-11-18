import { NavLink } from 'react-router-dom';
import { getUserType } from '../utils/auth';

export default function Navigation() {
  const userType = getUserType();

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/ingreso', label: 'Ingreso de Siniestro' },
    { to: '/consulta', label: 'Consulta de Estado' },
    { to: '/reporte', label: 'Reportes' }
  ];

  const clienteLinks = [
    { to: '/cliente', label: 'Inicio' },
    { to: '/ingreso', label: 'Ingreso de Siniestro' },
    { to: '/consulta', label: 'Consultar Estado' },
    { to: '/contacto', label: 'Contacto' }
  ];

  const links = userType === 'admin' ? adminLinks : clienteLinks;

  return (
    <nav className="main-nav">
      <ul>
        {links.map(link => (
          <li key={link.to}>
            <NavLink to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
