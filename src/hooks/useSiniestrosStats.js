import { useState, useEffect } from 'react';
import { siniestroService } from '../services/siniestroService';

export function useSiniestrosStats() {
  const [siniestros, setSiniestros] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const todosSiniestros = await siniestroService.getAllSiniestros();
      setSiniestros(todosSiniestros);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();

    const handleNuevoSiniestro = () => {
      cargarDatos();
    };

    window.addEventListener('siniestroCreado', handleNuevoSiniestro);

    return () => {
      window.removeEventListener('siniestroCreado', handleNuevoSiniestro);
    };
  }, []);

  return {
    siniestros,
    loading,
    recargarDatos: cargarDatos
  };
}