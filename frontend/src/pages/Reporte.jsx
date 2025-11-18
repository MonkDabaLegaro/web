import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { siniestroService } from '../services/siniestroService';
import { useSiniestrosStats } from '../hooks/useSiniestrosStats';

export default function Reporte() {
  const { siniestros, loading } = useSiniestrosStats();
  const [stats, setStats] = useState({
    ingresados: 0,
    enEvaluacion: 0,
    finalizados: 0,
    activos: 0,
    total: 0
  });
  const [tiposDanio, setTiposDanio] = useState({
    'Colisión': 0,
    'Robo': 0,
    'Incendio': 0,
    'Vandalismo': 0
  });
  const [liquidadorStats, setLiquidadorStats] = useState([]);

  useEffect(() => {
    // Calcular estadísticas generales
    const estadisticas = {
      ingresados: siniestros.filter(s => s.estado === 'Ingresado').length,
      enEvaluacion: siniestros.filter(s => s.estado === 'En Evaluación').length,
      finalizados: siniestros.filter(s => s.estado === 'Finalizado').length,
      activos: siniestros.filter(s => s.estado !== 'Finalizado').length,
      total: siniestros.length
    };

    setStats(estadisticas);

    // Contar tipos de daño
    const tipos = {
      'Colisión': 0,
      'Robo': 0,
      'Incendio': 0,
      'Vandalismo': 0
    };

    siniestros.forEach(s => {
      const tipo = s.tipoDanio || 'Colisión';
      if (tipos[tipo] !== undefined) {
        tipos[tipo]++;
      }
    });

    setTiposDanio(tipos);

    // Obtener estadísticas por liquidador desde el backend
    const cargarEstadisticasLiquidador = async () => {
      try {
        const estadisticasLiquidador = await siniestroService.getEstadisticasPorLiquidador();

        // Convertir el objeto en array para el componente
        const liquidadorArray = Object.entries(estadisticasLiquidador).map(([liquidador, datos]) => ({
          liquidador,
          cantidad: datos.total,
          finalizados: datos.finalizados,
          enEvaluacion: datos.enEvaluacion,
          ingresados: datos.ingresados,
          activos: datos.activos
        }));

        setLiquidadorStats(liquidadorArray);
      } catch (error) {
        console.error('Error al cargar estadísticas de liquidador:', error);
      }
    };

    cargarEstadisticasLiquidador();
  }, [siniestros]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const obtenerRecientes = () => {
    return siniestros
      .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <>
        <Header title="Sistema de Asistencia Vehicular" />
        <Navigation />
        <main className="main-content">
          <div className="loading">
            <h3>Cargando reportes...</h3>
          </div>
        </main>
      </>
    );
  }

  const recientes = obtenerRecientes();

  // Componentes inline
  const EstadosBarChart = ({ stats }) => {
    const data = [
      { label: 'Ingresados', value: stats.ingresados, color: '#409fff' },
      { label: 'En Evaluación', value: stats.enEvaluacion, color: '#ffbb2b' },
      { label: 'Finalizados', value: stats.finalizados, color: '#44c97b' },
      { label: 'Activos', value: stats.activos, color: '#fa914f' }
    ];
    const max = Math.max(...data.map(d => d.value), 1);
    
    return (
      <div className="panel-card estado-card">
        <h3>Estados de los Siniestros</h3>
        <div className="bar-chart-container-compact">
          <svg width="100%" height="150" viewBox="0 0 480 150" className="bar-chart-svg">
            {data.map((d, i) => {
              const barHeight = max > 0 ? (d.value / max) * 90 : 0;
              const barWidth = 50;
              const spacing = 480 / (data.length + 1);
              const x = spacing * (i + 1) - barWidth / 2;
              const y = 110 - barHeight;
              const baselineY = 110;
              
              return (
                <g key={d.label} className="bar-group">
                  {/* Barra con sombra */}
                  <rect x={x + 2} y={y + 2} width={barWidth} height={barHeight}
                        fill="#00000010" rx={6} />
                  <rect x={x} y={y} width={barWidth} height={barHeight}
                        fill={d.color} rx={6} className="bar-rect" />
                  
                  {/* Valor en la parte superior de la barra */}
                  {d.value > 0 && (
                    <text x={x + barWidth/2} y={y - 6}
                          textAnchor="middle" fontSize="14"
                          fill="#333" fontWeight="600" className="bar-value">
                      {d.value}
                    </text>
                  )}
                  
                  {/* Etiqueta en la parte inferior */}
                  <text x={x + barWidth/2} y={baselineY + 22}
                        textAnchor="middle" fontSize="12"
                        fill="#666" className="bar-label">
                    {d.label}
                  </text>
                  
                  {/* Línea base */}
                  <line x1={x} y1={baselineY} x2={x + barWidth} y2={baselineY}
                        stroke="#e0e6ed" strokeWidth="2" />
                </g>
              );
            })}
            
            {/* Línea base principal */}
            <line x1="35" y1={110} x2="445" y2={110} stroke="#d1d5db" strokeWidth="2" />
            
            {/* Grid lines para mejor referencia visual */}
            {[30, 60, 90].map((y, i) => (
              <line key={i} x1="35" y1={110 - (y * 90 / 100)} x2="445" y2={110 - (y * 90 / 100)}
                    stroke="#f0f0f0" strokeWidth="1" strokeDasharray="2,2" />
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const TiposPieChart = ({ tipos }) => {
    const colores = {
      'Colisión': '#409fff',
      'Robo': '#8a3ffc',
      'Incendio': '#48d3c3',
      'Vandalismo': '#ffbb2b',
    };
    const etiquetas = ['Colisión', 'Robo', 'Incendio', 'Vandalismo'];
    const total = etiquetas.reduce((sum, k) => sum + (tipos[k]||0), 0) || 1;

    let lastAngle = 0;
    const radio = 70;
    const centro = 90;
    const grosor = 33;
    const arcoPie = etiquetas.map((k, i) => {
      const v = tipos[k] || 0;
      const angle = (v / total) * 360;
      const start = lastAngle;
      const end = lastAngle + angle;
      lastAngle = end;
      const rad = a => (a-90) * Math.PI / 180;
      const x1 = centro + radio * Math.cos(rad(start));
      const y1 = centro + radio * Math.sin(rad(start));
      const x2 = centro + radio * Math.cos(rad(end));
      const y2 = centro + radio * Math.sin(rad(end));
      const arcFlag = angle > 180 ? 1 : 0;
      const path = `M ${centro} ${centro}\n      L ${x1} ${y1}\n      A ${radio} ${radio} 0 ${arcFlag} 1 ${x2} ${y2}\n      Z`;
      return v > 0 ? (
        <path key={k} d={path} fill={colores[k]} fillOpacity="0.92" stroke="#fff" strokeWidth="1.2" />
      ) : null;
    });

    return (
      <div className="panel-card tipos-card">
        <h3>Tipos de Daño</h3>
        <div className="pie-chart-container">
          <svg width={180} height={180} style={{display:'block'}}>
            <g>{arcoPie}</g>
            <circle cx={90} cy={90} r={radio-grosor} fill="#fff" />
          </svg>
          <div className="pie-legend" style={{minWidth: '100px'}}>
            {etiquetas.map(tipo => (
              <div className="pie-legend-item" key={tipo} style={{marginBottom: '0.3em', display:'flex',alignItems:'center'}}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', display:'inline-block', marginRight: 8, background: colores[tipo], border: '2.5px solid #fff', boxShadow: '0 0 3px #b0c4d9a0' }}></span>
                <span style={{fontSize: '0.95em', color:'#244', fontWeight: 400}}>{tipo} ({tipos[tipo] || 0})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const LiquidadorLineChart = ({ datos }) => {
    if (!datos || datos.length === 0) {
      return (
        <div className="panel-card">
          <h3>Siniestros por Liquidador</h3>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            No hay datos de liquidadores disponibles
          </div>
        </div>
      );
    }

    const max = Math.max(...datos.map(d=>d.cantidad), 1);
    
    // Calcular posiciones para cada punto con manejo especial para valores duplicados
    const puntos = datos.map((d, i) => {
      const left = (i / (datos.length - 1)) * 100;
      const baseTop = 100 - (d.cantidad / max) * 95;
      
      // Pequeño offset para evitar superposición de puntos con valores idénticos
      let top = baseTop;
      if (i > 0) {
        const valorAnterior = datos[i-1].cantidad;
        if (d.cantidad === valorAnterior) {
          // Aplicar un offset mínimo para separar visualmente
          top = baseTop + (Math.random() * 2 - 1); // Offset aleatorio de ±1%
        }
      }
      
      return {
        ...d,
        left,
        top
      };
    });

    return (
      <div className="panel-card liquidador-panel">
        <h3>Siniestros por Liquidador</h3>
        <div className="line-chart">
          <div className="line-chart-inner">
            {/* Puntos */}
            {puntos.map((punto, i) => (
              <div
                key={punto.liquidador}
                className="chart-point"
                style={{ left: `${punto.left}%`, top: `${punto.top}%` }}
                title={`${punto.liquidador}: ${punto.cantidad} siniestros (${punto.finalizados} finalizados, ${punto.activos} activos)`}
              ></div>
            ))}
            
            {/* Líneas conectoras usando SVG para mejor precisión */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 75"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: 'none'
              }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:'#409fff', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#8bc1fe', stopOpacity:1}} />
                </linearGradient>
              </defs>
              {puntos.slice(0, -1).map((punto, i) => {
                const siguiente = puntos[i + 1];
                // Usar coordenadas consistentes dentro del viewBox (0,0 a 100,75)
                const x1 = punto.left;                    // Ya está en porcentaje
                const y1 = punto.top * 0.75;              // Ajustar a la altura del viewBox
                const x2 = siguiente.left;
                const y2 = siguiente.top * 0.75;
                
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                );
              })}
            </svg>
          </div>
          <div className="line-chart-legend">
            {datos.map(d => (
              <span key={d.liquidador} title={`${d.cantidad} total, ${d.finalizados} finalizados`}>
                {d.liquidador} ({d.cantidad})
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SiniestrosRecientesList = ({ recientes }) => {
    const estadoColor = (estado) => {
      if (estado.includes('Finaliz')) return 'rec-estado finalizado';
      if (estado.toLowerCase().includes('ingres')) return 'rec-estado ingresado';
      if (estado.toLowerCase().includes('evalu')) return 'rec-estado eval';
      return 'rec-estado';
    };

    return (
      <div className="panel-card recientes-panel">
        <h3>Siniestros Recientes (Últimos 5)</h3>
        <div className="recent-list">
          {recientes.length > 0 ? (
            recientes.map((s, index) => (
              <div className="recent-item" key={s._id || index}>
                <div className="recent-datos">
                  <span className="recent-dato"><b>Fecha:</b> {formatearFecha(s.fechaRegistro)}</span>
                  <span className="recent-dato"><b>RUT:</b> {s.rut}</span>
                  <span className="recent-dato"><b>Póliza:</b> {s.numeroPoliza}</span>
                </div>
                <div className="recent-info">
                  <span><b>Daño:</b> {s.tipoDanio || s.tipoSeguro}</span>
                  <span className={estadoColor(s.estado)} style={{marginLeft: 8}}>{s.estado}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="recent-item">
              <p>No hay siniestros registrados</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header title="Sistema de Asistencia Vehicular" />
      <Navigation />
      <main className="main-content">
        <div className="report-grid">
          <EstadosBarChart stats={stats} />
          <TiposPieChart tipos={tiposDanio} />
          <LiquidadorLineChart datos={liquidadorStats} />
          <SiniestrosRecientesList recientes={recientes} />
        </div>
      </main>
      <style>{`
        .report-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          padding: 1rem 0;
        }
        .panel-card {
          background: #fff;
          box-shadow: 0 1px 8px #0001;
          padding: 1rem 0.8rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          min-height: auto;
          height: fit-content;
        }
        .panel-card.estado-card {
          padding: 0.6rem 0.4rem;
          height: 280px; /* Misma altura que tipos-card */
        }
        .panel-card.tipos-card {
          padding: 0.8rem 0.6rem;
          height: 280px; /* Altura de referencia */
        }
        .pie-chart-container {
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 1.5em;
          justify-content: center;
          height: auto;
          min-height: 160px;
        }
        .bar-chart-container-compact {
          margin: 0.1rem 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: auto;
          min-height: 100px;
        }
        .bar-chart-svg {
          max-width: 100%;
          height: 400px;
        }
        .bar-group {
          transition: all 0.3s ease;
        }
        .bar-rect {
          transition: all 0.2s ease;
        }
        .bar-rect:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }
        .bar-value {
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        }
        .bar-label {
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-anchor: middle;
        }
        .panel-card.liquidador-panel {
          height: 490px;
        }
        .panel-card.recientes-panel {
          height: 490px;
        }
        .line-chart {
          margin-top: 1em;
          flex: 1;
          display: flex;
          flex-direction: column;
          height: calc(490px - 3rem);
        }
        .line-chart-inner {
          position: relative;
          height: 150px;
          width: 100%;
          margin-bottom: 0.8em;
          background: linear-gradient(to top,#f6f8ff 85%,transparent 90%);
        }
        .chart-point {
          position: absolute;
          width: 11px; height: 11px; border-radius: 50%;
          background: #409fff; box-shadow: 0 2px 4px #0002;
          border: 2px solid #fff;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .chart-line {
          position: absolute; height: 3px; background: #8bc1fe; border-radius: 2px; z-index: 0;
        }
        .line-chart-inner svg {
          overflow: visible;
        }
        .line-chart-legend {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.2em 0.5em;
          font-size: 0.7em;
          margin-top: -0.3em;
          opacity: .74;
          flex: 1;
          align-content: start;
        }
        .line-chart-legend span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          padding: 0.1em 0;
          min-width: 0; /* Permite que el texto se trunque correctamente */
        }
        .recent-list{
          display: flex;
          flex-direction: column;
          gap: 0.8em;
          height: calc(490px - 4rem);
          overflow-y: auto;
        }
        .recent-item{
          border-radius: 8px;
          background: #f5f9ff;
          padding: 0.6em 0.8em;
          box-shadow: 0 1px 4px #0001;
        }
        .recent-datos{
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          font-size: 0.92em;
        }
        .recent-info{
          margin-top: 0.3em;
          display: flex;
          gap: 0.6em;
          align-items: center;
          font-size: 0.92em;
        }
        .rec-estado {
          font-weight: 600;
          border-radius: 4px;
          background: #e2eef8;
          color:#163a59;
          padding:2px 6px;
          font-size:.9em;
        }
        .rec-estado.eval { background: #faf5da; color:#78821a; border:1px solid #f7e5a3; }
        .rec-estado.finalizado { background: #ddfae2; color: #12742c; border:1px solid #2ab651; }
        .rec-estado.ingresado { background: #dff2fe; color:#1b658a; border:1px solid #67bdf9; }
      `}</style>
    </>
  );
}
