import { useMemo } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { siniestroManager } from '../services/siniestroService';
import { formatearFechaHora } from '../utils/validators';
import '../styles/main.css';

// ---- Componentes Auxiliares ----
function EstadosBarChart({ stats }) {
  const data = [
    { label: 'Ingresados', value: stats.ingresados, color: '#409fff' },
    { label: 'En Evaluación', value: stats.enEvaluacion, color: '#ffbb2b' },
    { label: 'Finalizados', value: stats.finalizados, color: '#44c97b' },
    { label: 'Activos', value: stats.activos, color: '#fa914f' }
  ];
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="panel-card">
      <h3>Estados de los Siniestros</h3>
      <svg width="100%" height="110" viewBox="0 0 260 110" style={{marginBottom: 16}}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * 70;
          const barWidth = 38;
          const x = 18 + i * 60;
          const y = 90 - barHeight;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight}
                    fill={d.color} rx={6} />
              <text x={x + barWidth/2} y={96} textAnchor="middle" fontSize="13" fill="#444">{d.label}</text>
              <text x={x + barWidth/2} y={y - 6} textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold">{d.value}</text>
            </g>
          );
        })}
        {/* Eje X */}
        <line x1="0" y1="90" x2="260" y2="90" stroke="#dee2e6" strokeWidth="2" />
      </svg>
    </div>
  );
}

function TiposPieChart({ tipos }) {
  // Los colores y el orden fijo
  const colores = {
    'Colisión': '#409fff',
    'Robo': '#8a3ffc',
    'Incendio': '#48d3c3',
    'Vandalismo': '#ffbb2b',
  };
  const etiquetas = ['Colisión', 'Robo', 'Incendio', 'Vandalismo'];
  const total = etiquetas.reduce((sum, k) => sum + (tipos[k]||0), 0) || 1;

  // Calcular los arcos con SVG:
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
    // Conversión polar a cartesian
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
    <div className="panel-card">
      <h3>Tipos de Daño</h3>
      <div style={{display:'flex',alignItems:'center',gap:'2.3em', justifyContent:'center'}}>
        <svg width={180} height={180} style={{display:'block'}}>
          <g>{arcoPie}</g>
          {/* Donut hueco blanco */}
          <circle cx={90} cy={90} r={radio-grosor} fill="#fff" />
        </svg>
        <div className="pie-legend" style={{minWidth: '102px'}}>
          {etiquetas.map(tipo => (
            <div className="pie-legend-item" key={tipo} style={{marginBottom: '0.38em', display:'flex',alignItems:'center'}}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', display:'inline-block', marginRight: 8, background: colores[tipo], border: '2.5px solid #fff', boxShadow: '0 0 3px #b0c4d9a0' }}></span>
              <span style={{fontSize: '1em', color:'#244', fontWeight: 400}}>{tipo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiquidadorLineChart({ datos }) {
  // datos: [{ liquidador, cantidad }]
  const max = Math.max(...datos.map(d=>d.cantidad), 1);
  return (
    <div className="panel-card">
      <h3>Siniestros por Liquidador</h3>
      <div className="line-chart">
        <div className="line-chart-inner">
          {/* Líneas y puntos */}
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
          {/* Líneas entre puntos */}
          {
            datos.slice(0, -1).map((d, i) => {
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
            })
          }
        </div>
        <div className="line-chart-legend">
          {datos.map(d => <span key={d.liquidador}>{d.liquidador}</span>)}
        </div>
      </div>
    </div>
  );
}

function SiniestrosRecientesList({ recientes }) {
  const estadoColor = estado => {
    if (estado.includes('Finaliz')) return 'rec-estado finalizado';
    if (estado.toLowerCase().includes('ingres')) return 'rec-estado ingresado';
    if (estado.toLowerCase().includes('evalu')) return 'rec-estado eval';
    return 'rec-estado';
  };
  return (
    <div className="panel-card">
      <h3>Siniestros Recientes (Últimos 5)</h3>
      <div className="recent-list">
        {recientes.map(s => (
          <div className="recent-item" key={s.id}>
            <div className="recent-datos">
              <span className="recent-dato"><b>Fecha:</b> {formatearFechaHora(s.fechaRegistro)}</span>
              <span className="recent-dato"><b>RUT:</b> {s.rut}</span>
              <span className="recent-dato"><b>Póliza:</b> {s.numeroPoliza}</span>
            </div>
            <div className="recent-info">
              <span><b>Daño:</b> {s.tipoDanio || s.tipoSeguro}</span>
              <span className={estadoColor(s.estado)} style={{marginLeft: 8}}>{s.estado}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reporte() {
  // Obtiene datos en render (simplificado, sin useEffect innecesario)
  const stats = useMemo(() => siniestroManager.getEstadisticas(), []);
  const recientes = useMemo(() => siniestroManager.getSiniestrosRecientes(), []);
  // -- estadística para pastel --
  const tipos = useMemo(() => {
    const tipos = { 'Colisión': 0, 'Robo': 0, 'Incendio': 0, 'Vandalismo': 0 };
    recientes.forEach(s => {
      const tipo = (s.tipoDanio || s.tipoSeguro || '').trim();
      if (tipos[tipo] !== undefined) tipos[tipo] += 1;
    });
    return tipos;
  }, [recientes]);
  // -- estadística para liquidador --
  const liquidadorStats = useMemo(() => {
    const tmp = {};
    recientes.forEach(s => {
      const lq = s.liquidador || 'Sin asignar';
      tmp[lq] = (tmp[lq] || 0) + 1;
    });
    return Object.entries(tmp).map(([liquidador, cantidad]) => ({ liquidador, cantidad }));
  }, [recientes]);

  return (
    <>
      <Header title="Reportes" />
      <Navigation />
      <main className="main-content">
        <div className="report-grid">
          <EstadosBarChart stats={stats} />
          <TiposPieChart tipos={tipos} />
          <LiquidadorLineChart datos={liquidadorStats} />
          <SiniestrosRecientesList recientes={recientes.slice(0,5)} />
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
        .bar-chart-group { margin-bottom: 0.75rem; }
        .bar-label { font-size: 1em; margin-bottom: .2em; }
        .bar-track {
          background: #e2eafc;
          border-radius: 24px;
          overflow: hidden;
          min-width: 150px;
          display: flex; align-items: center;
        }
        .bar-fill {
          height: 1.2em;
          border-radius: 20px;
          min-width: 2em;
          transition: width .5s;
        }
        .bar-value {
          padding-left: 0.8em;
          font-weight: 600;
        }
        .pie-chart { display: flex; gap: 2em; align-items: start; }
        .pie-sim {
          position: relative; width: 110px; height: 110px; border-radius: 50%; background: #eee;
        }
        .pie-slice {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          border-radius: 50%;
          clip-path: polygon(50% 50%, 100% 0%, 100% 100%);
          background: var(--color);
          transform: rotate(var(--start));
          z-index: 1;
        }
        .pie-legend { display: flex; flex-direction: column; gap: .7em; }
        .pie-legend-item { display: flex; align-items: center; font-size: .98em; }
        .legend-color {
          width: 1.2em; height: 1.2em; border-radius: 50%; display: inline-block; margin-right: 0.6em;
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
