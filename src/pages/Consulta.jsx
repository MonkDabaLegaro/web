// Página de consulta de siniestros

import { useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import ConsultaForm from '../components/ConsultaForm';
import ConsultaResults from '../components/ConsultaResults';
import { useSiniestros } from '../hooks/useSiniestros';

export default function Consulta() {
  const {
    siniestros,
    showResults,
    editingState,
    changingState,
    userType,
    loadingStates,
    estadosDisponibles,
    initializeUserType,
    buscarSiniestros,
    cambiarEstadoSiniestro,
    cancelarEdicionEstado,
    getStepClass,
    activarEdicionEstado
  } = useSiniestros();

  // Inicializar tipo de usuario al cargar el componente
  useEffect(() => {
    initializeUserType();
  }, [initializeUserType]);

  // Manejar cambio de estado con lógica especial para modo edición
  const handleChangeState = (siniestroId, newState) => {
    if (newState === 'edit') {
      // Activar modo edición
      activarEdicionEstado(siniestroId);
    } else {
      // Cambiar estado real
      cambiarEstadoSiniestro(siniestroId, newState);
    }
  };

  return (
    <>
      <Header />
      <Navigation />

      <main className="main-content">
        <ConsultaForm onBuscar={buscarSiniestros} />
        
        {showResults && siniestros.length > 0 && (
          <ConsultaResults
            siniestros={siniestros}
            userType={userType}
            estadosDisponibles={estadosDisponibles}
            editingState={editingState}
            changingState={changingState}
            loadingStates={loadingStates}
            onChangeState={handleChangeState}
            onCancelEdit={cancelarEdicionEstado}
            getStepClass={getStepClass}
          />
        )}
      </main>
    </>
  );
}
