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
  const [todosSiniestros, setTodosSiniestros] = useState([]);
  const [stats, setStats] = useState({
    activos: 0,
    completadosHoy: 0,
    gruasDisponibles: 0,
    talleresActivos: 0
  });
  const [actualizando, setActualizando] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const datos = await siniestroManager.obtenerSiniestros();
      setSiniestros(datos.slice(0, 5));
      setTodosSiniestros(datos);
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

  const actualizarEstadoSiniestro = async (id, nuevoEstado) => {
    setActualizando(id);
    try {
      await siniestroManager.actualizarEstado(id, nuevoEstado);
      await cargarDatos();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado del siniestro');
    } finally {
      setActualizando(null);
    }
  };

  const formatearFechaCompleta = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                    <small>RUT: {siniestro.rut} - Póliza: {siniestro.numero_poliza}</small>
                    <span className="activity-time">{formatearFecha(siniestro.fecha_registro)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="siniestros-management">
          <h3>Gestión de Siniestros</h3>
          <div className="table-container">
            {todosSiniestros.length === 0 ? (
              <p className="no-data">No hay siniestros registrados</p>
            ) : (
              <table className="siniestros-table">
                <thead>
                  <tr>
                    <th>RUT</th>
                    <th>Póliza</th>
                    <th>Tipo Seguro</th>
                    <th>Vehículo</th>
                    <th>Liquidador</th>
                    <th>Fecha Registro</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {todosSiniestros.map((siniestro) => (
                    <tr key={siniestro.id}>
                      <td>{siniestro.rut}</td>
                      <td>{siniestro.numero_poliza}</td>
                      <td>{siniestro.tipo_seguro}</td>
                      <td>{siniestro.vehiculo}</td>
                      <td>{siniestro.liquidador}</td>
                      <td>{formatearFechaCompleta(siniestro.fecha_registro)}</td>
                      <td>
                        <select
                          value={siniestro.estado}
                          onChange={(e) => actualizarEstadoSiniestro(siniestro.id, e.target.value)}
                          disabled={actualizando === siniestro.id}
                          className="estado-select"
                        >
                          <option value="Ingresado">Ingresado</option>
                          <option value="En Evaluación">En Evaluación</option>
                          <option value="Finalizado">Finalizado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
