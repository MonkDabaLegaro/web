import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { siniestroManager } from '../services/siniestroService';

export default function Reporte() {
  const [stats, setStats] = useState({
    ingresados: 0,
    enEvaluacion: 0,
    finalizados: 0,
    activos: 0,
    total: 0
  });
  const [siniestros, setSiniestros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tiposDanio, setTiposDanio] = useState({
    'Colisión': 0,
    'Robo': 0,
    'Incendio': 0,
    'Vandalismo': 0
  });
  const [liquidadorStats, setLiquidadorStats] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener todos los siniestros
      const todosSiniestros = await siniestroManager.getAllSiniestros();
      setSiniestros(todosSiniestros);
      
      // Calcular estadísticas
      const estadisticas = {
        ingresados: todosSiniestros.filter(s => s.estado === 'Ingresado').length,
        enEvaluacion: todosSiniestros.filter(s => s.estado === 'En Evaluación').length,
        finalizados: todosSiniestros.filter(s => s.estado === 'Finalizado').length,
        activos: todosSiniestros.filter(s => s.estado !== 'Finalizado').length,
        total: todosSiniestros.length
      };
      
      setStats(estadisticas);
      
      // Contar tipos de daño
      const tipos = {
        'Colisión': 0,
        'Robo': 0,
        'Incendio': 0,
        'Vandalismo': 0
      };
      
      todosSiniestros.forEach(s => {
        const tipo = s.tipoDanio || 'Colisión';
        if (tipos[tipo] !== undefined) {
          tipos[tipo]++;
        }
      });
      
      setTiposDanio(tipos);
      
      // Estadísticas por liquidador
      const liquidadores = {};
      todosSiniestros.forEach(s => {
        const liquidador = s.liquidador || 'Sin asignar';
        liquidadores[liquidador] = (liquidadores[liquidador] || 0) + 1;
      });
      
      const liquidadorArray = Object.entries(liquidadores).map(([liquidador, cantidad]) => ({
        liquidador,
        cantidad
      }));
      
      setLiquidadorStats(liquidadorArray);
      
    } catch (error) {
      console.error('Error al cargar datos de reportes:', error);
    } finally {
      setLoading(false);
    }
  };

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
    const max = Math.max(...datos.map(d=>d.cantidad), 1);
    return (
      <div className="panel-card">
        <h3>Siniestros por Liquidador</h3>
        <div className="line-chart">
          <div className="line-chart-inner">
            {datos.map((d, i) => {
              const left = (i / (datos.length - 1)) * 100;
              const top = 100 - (d.cantidad / max) * 95;
              return (
                <div
                  key={d.liquidador}
                  className="chart-point"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={d.liquidador+': '+d.cantidad}
                ></div>
              );
            })}
            {datos.slice(0, -1).map((d, i) => {
              const x1 = (i / (datos.length - 1)) * 100;
              const y1 = 100 - (d.cantidad / max) * 95;
              const x2 = ((i+1) / (datos.length - 1)) * 100;
              const y2 = 100 - (datos[i+1].cantidad / max) * 95;
              const style = {
                left: `${x1}%`,
                top: `${y1}%`,
                width: `${Math.sqrt((x2-x1)**2 + (y2-y1)**2)}%`,
                transform: `rotate(${Math.atan2(y2-y1, x2-x1) * 180/Math.PI}deg)`,
              };
              return <div key={i} className="chart-line" style={style}></div>;
            })}
          </div>
          <div className="line-chart-legend">
            {datos.map(d => <span key={d.liquidador}>{d.liquidador} ({d.cantidad})</span>)}
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
      <div className="panel-card">
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
          grid-template-rows: repeat(2, 1fr);
          gap: 2rem;
          padding: 2rem 0;
        }
        .panel-card {
          background: #fff;
          box-shadow: 0 1px 8px #0001;
          padding: 1.5rem 1rem;
          border-radius: 12px;
          display: flex; flex-direction: column;
          min-height: 260px;
        }
        .panel-card.estado-card {
          padding: 0.8rem 0.6rem;
          min-height: 160px;
        }
        .panel-card.tipos-card {
          padding: 1rem 0.8rem;
          min-height: 240px;
        }
        .pie-chart-container {
          margin: 0.8rem 0;
          display: flex;
          align-items: center;
          gap: 2em;
          justify-content: center;
          height: 200px;
        }
        .bar-chart-container-compact {
          margin: 0.2rem 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 120px;
        }
        .bar-chart-svg {
          max-width: 100%;
          height: 120px;
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
        .line-chart { margin-top: 1.5em; flex: 1; display: flex; flex-direction: column; }
        .line-chart-inner {
          position: relative;
          height: 75px; width: 100%;
          margin-bottom: 1em;
          background: linear-gradient(to top,#f6f8ff 85%,transparent 90%);
        }
        .chart-point {
          position: absolute;
          width: 13px; height: 13px; border-radius: 50%;
          background: #409fff; box-shadow: 0 2px 6px #0002;
          border: 2px solid #fff;
          transform: translate(-50%, -50%);
        }
        .chart-line {
          position: absolute; height: 3px; background: #8bc1fe; border-radius: 2px; z-index: 0;
        }
        .line-chart-legend {
          display: flex; justify-content: space-between;
          font-size: 0.91em; margin-top: -.6em; opacity: .74;
        }
        .recent-list{ display: flex; flex-direction: column; gap: 1em; }
        .recent-item{
          border-radius: 9px; background: #f5f9ff; padding: .7em 1em;
          box-shadow: 0 2px 6px #0001;
        }
        .recent-datos{ display: flex; flex-wrap: wrap; gap: 1.5em; font-size: .99em; }
        .recent-info{ margin-top:.1em; display: flex; gap:0.8em; align-items: center; }
        .rec-estado { font-weight: 600; border-radius: 5px; background: #e2eef8; color:#163a59; padding:2px 8px; font-size:.94em; }
        .rec-estado.eval { background: #faf5da; color:#78821a; border:1px solid #f7e5a3; }
        .rec-estado.finalizado { background: #ddfae2; color: #12742c; border:1px solid #2ab651; }
        .rec-estado.ingresado { background: #dff2fe; color:#1b658a; border:1px solid #67bdf9; }
      `}</style>
    </>
  );
}
