import Siniestro from '../models/Siniestro.js';

// Obtener todos los siniestros
export const getAllSiniestros = async (req, res) => {
  try {
    const siniestros = await Siniestro.find().sort({ fechaRegistro: -1 });
    res.json(siniestros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener siniestros', error: error.message });
  }
};

// Crear un nuevo siniestro
export const crearSiniestro = async (req, res) => {
  try {
    const {
      rut,
      nombreCliente,
      numeroPoliza,
      patente,
      marca,
      modelo,
      tipoDanio,
      tipoVehiculo,
      email,
      telefono,
      tipoSeguro = 'Automotriz'
    } = req.body;

    // Asignar liquidador, grúa y taller automáticamente
    const liquidador = asignarLiquidador();
    const grua = asignarGrua();
    const taller = asignarTaller();

    const nuevoSiniestro = new Siniestro({
      rut,
      nombreCliente,
      numeroPoliza,
      patente,
      marca,
      modelo,
      tipoDanio,
      tipoVehiculo,
      email,
      telefono,
      tipoSeguro,
      liquidador,
      grua,
      taller,
      estado: 'Ingresado'
    });

    const siniestroGuardado = await nuevoSiniestro.save();
    res.status(201).json(siniestroGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear siniestro', error: error.message });
  }
};

// Buscar siniestros por criterios
export const buscarSiniestros = async (req, res) => {
  try {
    const { rut, poliza, estado, tipo } = req.query;
    
    const filtros = {};
    if (rut) filtros.rut = rut;
    if (poliza) filtros.numeroPoliza = poliza;
    if (estado) filtros.estado = estado;
    if (tipo) filtros.tipoSeguro = tipo;

    const siniestros = await Siniestro.find(filtros).sort({ fechaRegistro: -1 });
    res.json(siniestros);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar siniestros', error: error.message });
  }
};

// Obtener un siniestro por ID
export const obtenerSiniestro = async (req, res) => {
  try {
    const siniestro = await Siniestro.findById(req.params.id);
    if (!siniestro) {
      return res.status(404).json({ message: 'Siniestro no encontrado' });
    }
    res.json(siniestro);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener siniestro', error: error.message });
  }
};

// Actualizar estado de un siniestro
export const actualizarEstado = async (req, res) => {
  try {
    const { nuevoEstado } = req.body;
    
    const siniestro = await Siniestro.findByIdAndUpdate(
      req.params.id,
      { 
        estado: nuevoEstado,
        fechaActualizacion: new Date()
      },
      { new: true }
    );

    if (!siniestro) {
      return res.status(404).json({ message: 'Siniestro no encontrado' });
    }

    res.json(siniestro);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar estado', error: error.message });
  }
};

// Obtener estadísticas
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
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

// Obtener estadísticas por tipo
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
    res.status(500).json({ message: 'Error al obtener estadísticas por tipo', error: error.message });
  }
};

// Obtener estadísticas por liquidador
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
    res.status(500).json({ message: 'Error al obtener estadísticas por liquidador', error: error.message });
  }
};

// Obtener siniestros recientes
export const getSiniestrosRecientes = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;
    const siniestros = await Siniestro.find()
      .sort({ fechaRegistro: -1 })
      .limit(limite);
    
    res.json(siniestros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener siniestros recientes', error: error.message });
  }
};

// Funciones auxiliares para asignación automática
function asignarLiquidador() {
  const liquidadores = [
    'María González',
    'Carlos López',
    'Ana Silva',
    'Pedro Martínez',
    'Luis Rodríguez',
    'Carmen Morales'
  ];
  return liquidadores[Math.floor(Math.random() * liquidadores.length)];
}

function asignarGrua() {
  const gruas = [
    'Grúa Express Norte',
    'Grúa Rápida Sur',
    'Grúa Central 24/7',
    'Grúa Metropolitana',
    'Grúa Oriente'
  ];
  return gruas[Math.floor(Math.random() * gruas.length)];
}

function asignarTaller() {
  const talleres = [
    'Taller Mecánico ABC',
    'Taller Automotriz Pro',
    'Taller Central Motors',
    'Taller Sur Especializado',
    'Taller Norte Premium'
  ];
  return talleres[Math.floor(Math.random() * talleres.length)];
}
