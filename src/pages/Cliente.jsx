import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Navigation from '../components/common/Navigation';
import { siniestroManager } from '../service/siniestroService';
import list from '../image/list.png';
import checkmark from '../image/Checkmark.png';
import folder from '../image/folder.png';

export default function Cliente() {
  const [siniestros, setSiniestros] = useState([]);

  useEffect(() => {
    cargarSiniestros();
  }, []);

  const cargarSiniestros = async () => {
    try {
      const datos = await siniestroManager.obtenerSiniestros();
      setSiniestros(datos.slice(0, 3));
    } catch (error) {
      console.error('Error al cargar siniestros:', error);
    }
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
      <Header title="Portal del Cliente" />
      <Navigation />

      <main className="main-content">
        <div className="welcome-section">
          <h2>Bienvenido al Sistema de Asistencia Vehicular</h2>
          <p>Consulta el estado de tu siniestro y mantente informado sobre el proceso de reparación.</p>
        </div>

        <div className="alert">
          <img src={list} alt="Alerta" className="alert-icon" />
          <span>Demoras en taller X - Estimamos 2 días adicionales</span>
        </div>

        <div className="benefits-section">
          <h3>Nuestros Servicios</h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={checkmark} alt="Atención Rápida" className="benefit-image" />
              </div>
              <h4>Atención Rápida</h4>
              <p>Respuesta inmediata a tu llamada de emergencia</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={folder} alt="Cobertura Nacional" className="benefit-image" />
              </div>
              <h4>Cobertura Nacional</h4>
              <p>Servicio disponible en todo el territorio nacional</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={list} alt="24/7" className="benefit-image" />
              </div>
              <h4>24/7</h4>
              <p>Disponible las 24 horas, los 7 días de la semana</p>
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
