import mongoose from 'mongoose';

const siniestroSchema = new mongoose.Schema({
  rut: {
    type: String,
    required: true,
    trim: true
  },
  nombreCliente: {
    type: String,
    required: true,
    trim: true
  },
  numeroPoliza: {
    type: String,
    required: true,
    trim: true
  },
  patente: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  tipoDanio: {
    type: String,
    required: true,
    enum: ['Colisión', 'Robo', 'Incendio', 'Vandalismo']
  },
  tipoVehiculo: {
    type: String,
    required: true,
    enum: ['Sedán', 'SUV', 'Camioneta', 'Moto']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  tipoSeguro: {
    type: String,
    default: 'Automotriz',
    enum: ['Automotriz', 'Moto', 'Comercial']
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    default: 'Ingresado',
    enum: ['Ingresado', 'En Evaluación', 'Finalizado']
  },
  liquidador: {
    type: String,
    required: true
  },
  grua: {
    type: String,
    required: true
  },
  taller: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Índices para optimizar búsquedas
siniestroSchema.index({ rut: 1, numeroPoliza: 1 });
siniestroSchema.index({ estado: 1 });
siniestroSchema.index({ fechaRegistro: -1 });

export default mongoose.model('Siniestro', siniestroSchema);

