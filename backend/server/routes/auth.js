import express from 'express';
import { register, login, verifyToken } from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken);


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
