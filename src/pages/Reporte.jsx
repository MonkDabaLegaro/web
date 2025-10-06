import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import Navigation from '../components/common/Navigation';
import { siniestroManager } from '../service/siniestroService';

export default function Reporte() {
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    finalizados: 0,
    enEvaluacion: 0,
    ingresados: 0
  });
  const [tipoStats, setTipoStats] = useState({});
  const [liquidadorStats, setLiquidadorStats] = useState({});
  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [estadisticas, tipos, liquidadores, siniestrosRecientes] = await Promise.all([
          siniestroManager.getEstadisticas(),
          siniestroManager.getEstadisticasPorTipo(),
          siniestroManager.getEstadisticasPorLiquidador(),
          siniestroManager.getSiniestrosRecientes(5)
        ]);

        setStats(estadisticas);
        setTipoStats(tipos);
        setLiquidadorStats(liquidadores);
        setRecientes(siniestrosRecientes);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTipoColor = (tipo) => {
    const colores = {
      'Automotriz': '#e74c3c',
      'Colisión': '#9b59b6',
      'Robo': '#2ecc71'
    };
    return colores[tipo] || '#3498db';
  };

  const liquidadoresArray = Object.entries(liquidadorStats).map(([nombre, datos]) => ({
    nombre,
    total: datos.total
  }));

  if (loading) {
    return (
      <>
        <Header />
        <Navigation />
        <main className="main-content">
          <div className="report-container">
            <p>Cargando datos...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <Navigation />

      <main className="main-content">
        <div className="report-container">
          <div className="report-grid">
            <div className="report-card">
              <h3>Estados de los Siniestros</h3>
              <div className="chart-container">
                <div className="bar-chart">
                  <div className="bar-group">
                    <div className="bar" style={{ height: `${(stats.ingresados / Math.max(stats.total, 1)) * 200}px`, backgroundColor: '#3498db' }}></div>
                    <span className="bar-label">Ingresados</span>
                    <span className="bar-value">{stats.ingresados}</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ height: `${(stats.enEvaluacion / Math.max(stats.total, 1)) * 200}px`, backgroundColor: '#95a5a6' }}></div>
                    <span className="bar-label">En Evaluación</span>
                    <span className="bar-value">{stats.enEvaluacion}</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ height: `${(stats.finalizados / Math.max(stats.total, 1)) * 200}px`, backgroundColor: '#95a5a6' }}></div>
                    <span className="bar-label">Finalizados</span>
                    <span className="bar-value">{stats.finalizados}</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ height: `${(stats.activos / Math.max(stats.total, 1)) * 200}px`, backgroundColor: '#f39c12' }}></div>
                    <span className="bar-label">Activos</span>
                    <span className="bar-value">{stats.activos}</span>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#3498db' }}></span>
                    <span>Cantidad</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="report-card">
              <h3>Tipos de Daño</h3>
              <div className="chart-container">
                <div className="pie-chart-wrapper">
                  <svg viewBox="0 0 200 200" className="pie-chart">
                    {(() => {
                      let currentAngle = 0;
                      const total = Object.values(tipoStats).reduce((a, b) => a + b, 0);

                      if (total === 0) {
                        return (
                          <circle cx="100" cy="100" r="80" fill="#e0e0e0" />
                        );
                      }

                      return Object.entries(tipoStats).map(([tipo, cantidad], index) => {
                        const percentage = (cantidad / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;

                        const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);

                        const largeArc = angle > 180 ? 1 : 0;
                        const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        currentAngle += angle;

                        return (
                          <path
                            key={tipo}
                            d={pathData}
                            fill={getTipoColor(tipo)}
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
                <div className="chart-legend">
                  {Object.entries(tipoStats).map(([tipo, cantidad]) => (
                    <div key={tipo} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: getTipoColor(tipo) }}></span>
                      <span>{tipo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="report-card">
              <h3>Siniestros por Liquidador</h3>
              <div className="chart-container">
                <div className="line-chart">
                  <svg viewBox="0 0 300 200" className="line-chart-svg">
                    <line x1="30" y1="10" x2="30" y2="170" stroke="#ddd" strokeWidth="1" />
                    <line x1="30" y1="170" x2="290" y2="170" stroke="#ddd" strokeWidth="1" />

                    {liquidadoresArray.length > 0 && (() => {
                      const maxValue = Math.max(...liquidadoresArray.map(l => l.total), 1);
                      const points = liquidadoresArray.map((liq, index) => {
                        const x = 50 + (index * (220 / Math.max(liquidadoresArray.length - 1, 1)));
                        const y = 160 - ((liq.total / maxValue) * 140);
                        return { x, y, nombre: liq.nombre, total: liq.total };
                      });

                      const pathData = points.map((p, i) =>
                        i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                      ).join(' ');

                      return (
                        <>
                          <path
                            d={pathData}
                            fill="none"
                            stroke="#3498db"
                            strokeWidth="2"
                          />
                          {points.map((p, i) => (
                            <circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              fill="#3498db"
                            />
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                  <div className="liquidador-labels">
                    {liquidadoresArray.slice(0, 3).map((liq, index) => (
                      <span key={index} className="liquidador-label">
                        {liq.nombre.split(' ')[0]} {liq.nombre.split(' ')[1]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#3498db' }}></span>
                    <span>Total por liquidador</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="report-card">
              <h3>Siniestros Recientes (Últimos 5)</h3>
              <div className="recent-list">
                {recientes.length === 0 ? (
                  <p className="no-data">No hay siniestros registrados</p>
                ) : (
                  recientes.map((siniestro) => (
                    <div key={siniestro.id} className="recent-item">
                      <div className="recent-bullet">•</div>
                      <div className="recent-content">
                        <p className="recent-date">
                          {formatearFecha(siniestro.fecha_registro)} | RUT: {siniestro.rut} | Póliza: {siniestro.numero_poliza}
                        </p>
                        <p className="recent-details">
                          Daño: {siniestro.tipo_seguro} | Estado: {siniestro.estado}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
