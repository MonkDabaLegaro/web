import express from 'express';
import {
  getAllSiniestros,
  crearSiniestro,
  buscarSiniestros,
  obtenerSiniestro,
  actualizarEstado,
  getEstadisticas,
  getEstadisticasPorTipo,
  getEstadisticasPorLiquidador,
  getSiniestrosRecientes
} from '../controllers/siniestroController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get('/buscar', buscarSiniestros); // Para consultas de clientes

// Rutas protegidas (requieren autenticación)
router.use(authenticateToken);

// Rutas para todos los usuarios autenticados
router.get('/', getAllSiniestros);
router.get('/recientes', getSiniestrosRecientes);
router.get('/estadisticas', getEstadisticas);
router.get('/estadisticas/tipo', getEstadisticasPorTipo);
router.get('/estadisticas/liquidador', getEstadisticasPorLiquidador);
router.get('/:id', obtenerSiniestro);

// Rutas solo para administradores
router.post('/', requireAdmin, crearSiniestro);
router.patch('/:id/estado', requireAdmin, actualizarEstado);

export default router;
