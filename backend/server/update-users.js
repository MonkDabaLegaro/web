#!/usr/bin/env node

/**
 * Script para actualizar contraseñas de usuarios existentes a texto plano
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './backend/server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema_siniestros';

async function updateUsers() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB exitosamente');

    // Actualizar usuarios existentes
    const User = (await import('./models/User.js')).default;

    // Actualizar admin
    await User.updateOne(
      { username: 'admin' },
      { password: 'Admin2024!' }
    );
    console.log('Usuario admin actualizado');

    // Actualizar cliente
    await User.updateOne(
      { username: 'cliente' },
      { password: 'Cliente2024!' }
    );
    console.log('Usuario cliente actualizado');

    console.log('Usuarios actualizados exitosamente');

  } catch (error) {
    console.error('Error al actualizar usuarios:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
  }
}

// Ejecutar la actualización
updateUsers();