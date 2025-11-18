import { useState, useCallback } from 'react';
import { siniestroService } from '../services/siniestroService';
import { getUserType } from '../utils/auth';

export function useSiniestros() {
  const [siniestros, setSiniestros] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [changingState, setChangingState] = useState(false);
  const [userType, setUserType] = useState('cliente');
  const [loadingStates, setLoadingStates] = useState({});

  const estadosDisponibles = ['Ingresado', 'En Evaluación', 'Finalizado'];
  const initializeUserType = useCallback(() => {
    setUserType(getUserType() || 'cliente');
  }, []);

  const buscarSiniestros = useCallback(async (criterios) => {
    try {
      const resultados = await siniestroService.buscarSiniestros(criterios);
      
      if (resultados.length === 0) {
        alert('No se encontró información para el RUT y póliza ingresados');
        setShowResults(false);
        return;
      }

      setSiniestros(resultados);
      setShowResults(true);
    } catch (error) {
      console.error('Error al consultar siniestros:', error);
      alert('Error al consultar siniestros. Verifique que el servidor esté ejecutándose.');
    }
  }, []);

  const cambiarEstadoSiniestro = useCallback(async (siniestroId, newState) => {
    try {
      setChangingState(true);
      setLoadingStates(prev => ({ ...prev, [siniestroId]: true }));

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      }

      await siniestroService.actualizarEstado(siniestroId, newState);

      // Actualizar el estado local del siniestro
      setSiniestros(prevSiniestros =>
        prevSiniestros.map(siniestro =>
          siniestro._id === siniestroId
            ? { ...siniestro, estado: newState, fechaActualizacion: new Date() }
            : siniestro
        )
      );

      setEditingState(null);
      alert('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      let errorMessage = 'Error al cambiar el estado del siniestro';
      
      if (error.message) {
        if (error.message.includes('token') || error.message.includes('autenticación')) {
          errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = 'No tiene permisos para realizar esta acción.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Siniestro no encontrado.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
      // No cerrar el modo edición en caso de error para permitir reintentar
    } finally {
      setChangingState(false);
      setLoadingStates(prev => ({ ...prev, [siniestroId]: false }));
    }
  }, []);

  const cancelarEdicionEstado = useCallback(() => {
    setEditingState(null);
  }, []);

  const activarEdicionEstado = useCallback((siniestroId) => {
    setEditingState(siniestroId);
  }, []);

  const getStepClass = useCallback((estado, step) => {
    const estados = ['Ingresado', 'En Evaluación', 'Finalizado'];
    const currentIndex = estados.indexOf(estado);
    const stepIndex = step - 1;

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return '';
  }, []);

  return {
    // Estado
    siniestros,
    showResults,
    editingState,
    changingState,
    userType,
    loadingStates,
    estadosDisponibles,
    
    // Acciones
    initializeUserType,
    buscarSiniestros,
    cambiarEstadoSiniestro,
    cancelarEdicionEstado,
    getStepClass,
    
    // Setters
    setShowResults,
    
    // Acciones adicionales
    activarEdicionEstado
  };
}