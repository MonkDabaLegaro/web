import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    const { username, password, userType, email, nombre } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const newUser = new User({
      username,
      password,
      userType,
      email,
      nombre
    });

    await newUser.save();

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser._id, userType: newUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        userType: newUser.userType,
        email: newUser.email,
        nombre: newUser.nombre
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ username, activo: true });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Verificar token
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido', error: error.message });
  }
};

// Crear usuarios por defecto (para desarrollo)
export const createDefaultUsers = async (req, res) => {
  try {
    // Verificar si ya existen usuarios
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.json({ message: 'Los usuarios por defecto ya existen' });
    }

    // Crear usuarios por defecto
    const defaultUsers = [
      {
        username: 'admin',
        password: '1234',
        userType: 'admin',
        email: 'admin@sistema.com',
        nombre: 'Administrador'
      },
      {
        username: 'cliente',
        password: '5678',
        userType: 'cliente',
        email: 'cliente@sistema.com',
        nombre: 'Cliente Demo'
      }
    ];

    for (const userData of defaultUsers) {
      const user = new User(userData);
      await user.save();
    }

    res.json({ message: 'Usuarios por defecto creados exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuarios por defecto', error: error.message });
  }
};
