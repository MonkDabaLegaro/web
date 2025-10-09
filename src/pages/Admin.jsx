import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Navigation from '../components/common/Navigation';
import { siniestroManager } from '../service/siniestroService';
import folder from '../image/folder.png';
import checkmark from '../image/Checkmark.png';
import yellowCheckMark from '../image/YellowCheckMark.png';
import list from '../image/list.png';

export default function Admin() {
  const [siniestros, setSiniestros] = useState([]);
  const [stats, setStats] = useState({
    activos: 0,
    completadosHoy: 0,
    gruasDisponibles: 0,
    talleresActivos: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const datos = await siniestroManager.obtenerSiniestros();
      setSiniestros(datos.slice(0, 5));
      calcularEstadisticas(datos);
    } catch (error) {
      console.error('Error al cargar siniestros:', error);
    }
  };

  const calcularEstadisticas = (datos) => {
    const activos = datos.filter(s => s.estado === 'Ingresado' || s.estado === 'En Evaluación').length;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const completadosHoy = datos.filter(s => {
      const fecha = new Date(s.fechaCreacion);
      fecha.setHours(0, 0, 0, 0);
      return s.estado === 'Finalizado' && fecha.getTime() === hoy.getTime();
    }).length;

    setStats({
      activos,
      completadosHoy,
      gruasDisponibles: 12,
      talleresActivos: 6
    });
  };

  const formatearFecha = (fecha) => {
    const ahora = new Date();
    const fechaSiniestro = new Date(fecha);
    const diferencia = Math.floor((ahora - fechaSiniestro) / 1000);

    if (diferencia < 60) return 'Hace un momento';
    if (diferencia < 3600) return `Hace ${Math.floor(diferencia / 60)} minutos`;
    if (diferencia < 86400) return `Hace ${Math.floor(diferencia / 3600)} horas`;
    return `Hace ${Math.floor(diferencia / 86400)} días`;
  };

  const getIconoPorEstado = (estado) => {
    switch (estado) {
      case 'Ingresado':
        return folder;
      case 'En Evaluación':
        return list;
      case 'Finalizado':
        return checkmark;
      default:
        return folder;
    }
  };

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
              <img src={folder} alt="Activos" />
            </div>
            <div className="stat-content">
              <h3>Siniestros Activos</h3>
              <p className="stat-number">{stats.activos}</p>
              <small>En proceso</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src={checkmark} alt="Completados" />
            </div>
            <div className="stat-content">
              <h3>Completados Hoy</h3>
              <p className="stat-number">{stats.completadosHoy}</p>
              <small>Finalizados</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src={yellowCheckMark} alt="Grúas" />
            </div>
            <div className="stat-content">
              <h3>Grúas Disponibles</h3>
              <p className="stat-number">{stats.gruasDisponibles}</p>
              <small>En servicio</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <img src={list} alt="Talleres" />
            </div>
            <div className="stat-content">
              <h3>Talleres Activos</h3>
              <p className="stat-number">{stats.talleresActivos}</p>
              <small>Operativos</small>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            {siniestros.length === 0 ? (
              <p className="no-data">No hay actividad reciente</p>
            ) : (
              siniestros.map((siniestro) => (
                <div key={siniestro.id} className="activity-item">
                  <img src={getIconoPorEstado(siniestro.estado)} alt={siniestro.estado} className="activity-icon" />
                  <div className="activity-content">
                    <p><strong>{siniestro.estado}</strong></p>
                    <small>RUT: {siniestro.rut} - Póliza: {siniestro.numeroPoliza}</small>
                    <span className="activity-time">{formatearFecha(siniestro.fechaCreacion)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
