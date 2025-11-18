// Controlador principal para gestión de siniestros

import Siniestro from '../models/Siniestro.js';
import { assignAllResources } from '../utils/assignmentHelpers.js';

// Obtener todos los siniestros
export const getAllSiniestros = async (req, res) => {
  try {
    const siniestros = await Siniestro.find().sort({ fechaRegistro: -1 });
    res.json(siniestros);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener siniestros', 
      error: error.message 
    });
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

    // Asignar recursos automáticamente
    const resources = assignAllResources();

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
      ...resources,
      estado: 'Ingresado'
    });

    const siniestroGuardado = await nuevoSiniestro.save();
    res.status(201).json(siniestroGuardado);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error al crear siniestro', 
      error: error.message 
    });
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
    res.status(500).json({ 
      message: 'Error al buscar siniestros', 
      error: error.message 
    });
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
    res.status(500).json({ 
      message: 'Error al obtener siniestro', 
      error: error.message 
    });
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
    res.status(400).json({ 
      message: 'Error al actualizar estado', 
      error: error.message 
    });
  }
};