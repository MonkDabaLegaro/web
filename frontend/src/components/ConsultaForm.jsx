import { useState } from 'react';
import { validarRUT } from '../utils/validators';

export default function ConsultaForm({ onBuscar }) {
  const [formData, setFormData] = useState({
    rutConsulta: '',
    polizaConsulta: ''
  });

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

    onBuscar({
      rut: formData.rutConsulta,
      poliza: formData.polizaConsulta
    });
  };

  return (
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
  );
}