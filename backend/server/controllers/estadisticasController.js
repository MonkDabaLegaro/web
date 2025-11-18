// Controlador para estadísticas de siniestros

import Siniestro from '../models/Siniestro.js';

// Estadísticas generales
export const getEstadisticas = async (req, res) => {
  try {
    const total = await Siniestro.countDocuments();
    const activos = await Siniestro.countDocuments({ estado: { $ne: 'Finalizado' } });
    const finalizados = await Siniestro.countDocuments({ estado: 'Finalizado' });
    const enEvaluacion = await Siniestro.countDocuments({ estado: 'En Evaluación' });
    const ingresados = await Siniestro.countDocuments({ estado: 'Ingresado' });

    res.json({
      total,
      activos,
      finalizados,
      enEvaluacion,
      ingresados
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener estadísticas', 
      error: error.message 
    });
  }
};

// Estadísticas por tipo
export const getEstadisticasPorTipo = async (req, res) => {
  try {
    const estadisticas = await Siniestro.aggregate([
      {
        $group: {
          _id: '$tipoSeguro',
          count: { $sum: 1 }
        }
      }
    ]);

    const resultado = {};
    estadisticas.forEach(stat => {
      resultado[stat._id] = stat.count;
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener estadísticas por tipo', 
      error: error.message 
    });
  }
};

// Estadísticas por liquidador
export const getEstadisticasPorLiquidador = async (req, res) => {
  try {
    const estadisticas = await Siniestro.aggregate([
      {
        $group: {
          _id: '$liquidador',
          total: { $sum: 1 },
          finalizados: {
            $sum: { $cond: [{ $eq: ['$estado', 'Finalizado'] }, 1, 0] }
          },
          enEvaluacion: {
            $sum: { $cond: [{ $eq: ['$estado', 'En Evaluación'] }, 1, 0] }
          },
          ingresados: {
            $sum: { $cond: [{ $eq: ['$estado', 'Ingresado'] }, 1, 0] }
          }
        }
      }
    ]);

    const resultado = {};
    estadisticas.forEach(stat => {
      resultado[stat._id] = {
        total: stat.total,
        finalizados: stat.finalizados,
        enEvaluacion: stat.enEvaluacion,
        ingresados: stat.ingresados,
        activos: stat.total - stat.finalizados
      };
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener estadísticas por liquidador', 
      error: error.message 
    });
  }
};

// Siniestros recientes
export const getSiniestrosRecientes = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;
    const siniestros = await Siniestro.find()
      .sort({ fechaRegistro: -1 })
      .limit(limite);
    
    res.json(siniestros);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener siniestros recientes', 
      error: error.message 
    });
  }
};