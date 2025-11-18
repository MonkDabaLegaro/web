import { useState } from 'react';

export default function ConsultaResults({
  siniestros, 
  userType, 
  estadosDisponibles, 
  editingState, 
  changingState, 
  loadingStates, 
  onChangeState, 
  onCancelEdit,
  getStepClass 
}) {
  if (!siniestros || siniestros.length === 0) return null;

  return (
    <div className="results-container">
      <h2>Resultados de la Consulta</h2>
      <p>
        Se encontraron {siniestros.length} siniestro{siniestros.length > 1 ? 's' : ''} para el RUT
      </p>
      
      {siniestros.map((siniestro) => (
        <SiniestroCard 
          key={siniestro._id}
          siniestro={siniestro}
          userType={userType}
          estadosDisponibles={estadosDisponibles}
          editingState={editingState}
          changingState={changingState}
          loadingStates={loadingStates}
          onChangeState={onChangeState}
          onCancelEdit={onCancelEdit}
          getStepClass={getStepClass}
        />
      ))}
    </div>
  );
}

function SiniestroCard({ 
  siniestro, 
  userType, 
  estadosDisponibles, 
  editingState, 
  changingState, 
  loadingStates, 
  onChangeState, 
  onCancelEdit,
  getStepClass 
}) {
  return (
    <div className="siniestro-card">
      <div className="siniestro-header">
        <h3>Siniestro #{siniestro._id}</h3>
        <span className="siniestro-fecha">
          Registrado: {new Date(siniestro.fechaRegistro).toLocaleDateString('es-CL')}
        </span>
      </div>
      
      <div className="progress-container">
        <div className="progress-and-controls">
          <ProgressBar 
            estado={siniestro.estado}
            getStepClass={getStepClass}
          />
          
          {userType === 'admin' && (
            <AdminControls 
              siniestro={siniestro}
              estadosDisponibles={estadosDisponibles}
              editingState={editingState}
              changingState={changingState}
              loadingStates={loadingStates}
              onChangeState={onChangeState}
              onCancelEdit={onCancelEdit}
            />
          )}
        </div>
      </div>

      <DetailsContainer siniestro={siniestro} />
    </div>
  );
}

function ProgressBar({ estado, getStepClass }) {
  return (
    <div className="progress-bar">
      <div className={`progress-step ${getStepClass(estado, 1)}`}>
        <div className="step-circle">
          <img src="/image/folder.png" alt="Ingresado" className="step-icon" />
        </div>
        <span>Ingresado</span>
      </div>
      <div className={`progress-line ${getStepClass(estado, 2)}`}></div>
      <div className={`progress-step ${getStepClass(estado, 2)}`}>
        <div className="step-circle">
          <img src="/image/list.png" alt="En Evaluación" className="step-icon" />
        </div>
        <span>En Evaluación</span>
      </div>
      <div className={`progress-line ${getStepClass(estado, 3)}`}></div>
      <div className={`progress-step ${getStepClass(estado, 3)}`}>
        <div className="step-circle">
          <img src="/image/Checkmark.png" alt="Finalizado" className="step-icon" />
        </div>
        <span>Finalizado</span>
      </div>
    </div>
  );
}

function AdminControls({ 
  siniestro, 
  estadosDisponibles, 
  editingState, 
  changingState, 
  loadingStates, 
  onChangeState, 
  onCancelEdit 
}) {
  return (
    <div className="admin-controls-inline">
      {editingState === siniestro._id ? (
        <StateEditForm 
          siniestro={siniestro}
          estadosDisponibles={estadosDisponibles}
          changingState={changingState}
          loadingStates={loadingStates}
          onChangeState={onChangeState}
          onCancelEdit={onCancelEdit}
        />
      ) : (
        <StateDisplay 
          siniestro={siniestro}
          changingState={changingState}
          onEdit={() => onChangeState(siniestro._id, 'edit')}
        />
      )}
    </div>
  );
}

function StateEditForm({
  siniestro,
  estadosDisponibles,
  changingState,
  loadingStates,
  onChangeState,
  onCancelEdit
}) {
  const [selectedEstado, setSelectedEstado] = useState(siniestro.estado);
  const [hasChanges, setHasChanges] = useState(false);

  const handleEstadoChange = (e) => {
    setSelectedEstado(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (hasChanges) {
      onChangeState(siniestro._id, selectedEstado);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    setSelectedEstado(siniestro.estado);
    setHasChanges(false);
    onCancelEdit();
  };

  return (
    <div className="state-edit-container-inline">
      <select
        value={selectedEstado}
        onChange={handleEstadoChange}
        disabled={changingState || loadingStates[siniestro._id]}
      >
        {estadosDisponibles.map(estado => (
          <option key={estado} value={estado}>{estado}</option>
        ))}
      </select>
      
      {hasChanges && (
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={changingState || loadingStates[siniestro._id]}
        >
          Guardar
        </button>
      )}
      
      <button
        onClick={handleCancel}
        className="btn btn-secondary"
        disabled={changingState || loadingStates[siniestro._id]}
      >
        {hasChanges ? 'Descartar' : 'Cancelar'}
      </button>
      
      {loadingStates[siniestro._id] && (
        <span className="loading-text">Actualizando...</span>
      )}
    </div>
  );
}

function StateDisplay({ siniestro, changingState, onEdit }) {
  return (
    <div className="state-display-inline">
      <span className="current-state">Estado: <strong>{siniestro.estado}</strong></span>
      <button
        onClick={onEdit}
        className="btn btn-edit"
        disabled={changingState}
      >
        <img src="/image/YellowCheckMark.png" alt="Editar" className="btn-icon yellow-checkmark-icon" />
        Cambiar Estado
      </button>
    </div>
  );
}

function DetailsContainer({ siniestro }) {
  const details = [
    { icon: '/image/folder.png', label: 'Grúa', value: siniestro.grua },
    { icon: '/image/list.png', label: 'Taller', value: siniestro.taller },
    { icon: '/image/Checkmark.png', label: 'Liquidador', value: siniestro.liquidador }
  ];

  return (
    <div className="details-container">
      {details.map((detail, index) => (
        <div key={index} className="detail-item">
          <img src={detail.icon} alt={detail.label} className="detail-icon" />
          <span className="detail-label">{detail.label}</span>
          <span className="detail-value">{detail.value}</span>
        </div>
      ))}
    </div>
  );
}