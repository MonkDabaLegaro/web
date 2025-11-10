import express from 'express';
import { register, login, verifyToken, createDefaultUsers } from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken);

// Ruta para crear usuarios por defecto (solo para desarrollo)
router.post('/create-default-users', createDefaultUsers);

// Rutas protegidas
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      userType: req.user.userType,
      email: req.user.email,
      nombre: req.user.nombre
    }
  });
});

export default router;
