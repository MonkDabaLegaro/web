import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar autenticación
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.activo) {
      return res.status(401).json({ message: 'Usuario no válido o inactivo' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar roles de administrador
export const requireAdmin = (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
  }
  next();
};

// Middleware para verificar roles de cliente
export const requireClient = (req, res, next) => {
  if (req.user.userType !== 'cliente') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de cliente' });
  }
  next();
};
