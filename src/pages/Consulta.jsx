import { useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { siniestroManager } from '../services/siniestroService';
import { validarRUT } from '../utils/validators';

export default function Consulta() {
  const [formData, setFormData] = useState({
    rutConsulta: '',
    polizaConsulta: ''
  });
  const [siniestro, setSiniestro] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarRUT(formData.rutConsulta)) {
      alert('RUT inválido. Formato esperado: 12345678-9');
      return;
    }

    const resultado = siniestroManager.buscarSiniestro(
      formData.rutConsulta,
      formData.polizaConsulta
    );

    if (!resultado) {
      alert('No se encontró información para el RUT y póliza ingresados');
      setShowResults(false);
      return;
    }

    setSiniestro(resultado);
    setShowResults(true);
  };

  const getStepClass = (estado, step) => {
    const estados = ['Ingresado', 'En Evaluación', 'Finalizado'];
    const currentIndex = estados.indexOf(estado);
    const stepIndex = step - 1;

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return '';
  };

  return (
    <>
      <Header />
      <Navigation />

      <main className="main-content">
        <div className="form-container">
          <h1>Consulta de Estado del Siniestro</h1>
          <p>Ingrese su RUT y número de póliza para consultar el estado de su siniestro.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>RUT del Asegurado</label>
                <input
                  type="text"
                  id="rutConsulta"
                  placeholder="12.345.678-9"
                  value={formData.rutConsulta}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Número de Póliza</label>
                <input
                  type="text"
                  id="polizaConsulta"
                  placeholder="POL123"
                  value={formData.polizaConsulta}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <img src="/image/list.png" alt="Consultar" className="btn-icon" />
                Consultar
              </button>
            </div>
          </form>
        </div>

        {showResults && siniestro && (
          <>
            <div className="progress-container">
              <div className="progress-bar">
                <div className={`progress-step ${getStepClass(siniestro.estado, 1)}`}>
                  <div className="step-circle">
                    <img src="/image/folder.png" alt="Ingresado" className="step-icon" />
                  </div>
                  <span>Ingresado</span>
                </div>
                <div className={`progress-line ${getStepClass(siniestro.estado, 2)}`}></div>
                <div className={`progress-step ${getStepClass(siniestro.estado, 2)}`}>
                  <div className="step-circle">
                    <img src="/image/list.png" alt="En Evaluación" className="step-icon" />
                  </div>
                  <span>En Evaluación</span>
                </div>
                <div className={`progress-line ${getStepClass(siniestro.estado, 3)}`}></div>
                <div className={`progress-step ${getStepClass(siniestro.estado, 3)}`}>
                  <div className="step-circle">
                    <img src="/image/Checkmark.png" alt="Finalizado" className="step-icon" />
                  </div>
                  <span>Finalizado</span>
                </div>
              </div>
            </div>

            <div className="details-container">
              <div className="detail-item">
                <img src="/image/folder.png" alt="Grúa" className="detail-icon" />
                <span className="detail-label">Grúa</span>
                <span className="detail-value">{siniestro.grua}</span>
              </div>
              <div className="detail-item">
                <img src="/image/list.png" alt="Taller" className="detail-icon" />
                <span className="detail-label">Taller</span>
                <span className="detail-value">{siniestro.taller}</span>
              </div>
              <div className="detail-item">
                <img src="/image/Checkmark.png" alt="Liquidador" className="detail-icon" />
                <span className="detail-label">Liquidador</span>
                <span className="detail-value">{siniestro.liquidador}</span>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
