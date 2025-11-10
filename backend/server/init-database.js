#!/usr/bin/env node

/**
 * Script para inicializar y verificar la base de datos MongoDB
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Siniestro from './models/Siniestro.js';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema_siniestros';

async function initializeDatabase() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');

    // Verificar usuarios existentes
    const userCount = await User.countDocuments();
    console.log(`📊 Total de usuarios en la base de datos: ${userCount}`);

    // Crear usuarios por defecto si no existen
    if (userCount === 0) {
      console.log('👥 Creando usuarios por defecto...');
      
      const defaultUsers = [
        {
          username: 'admin',
          password: 'Admin2024!',
          userType: 'admin',
          email: 'admin@sistema.com',
          nombre: 'Administrador'
        },
        {
          username: 'cliente',
          password: 'Cliente2024!',
          userType: 'cliente',
          email: 'cliente@sistema.com',
          nombre: 'Cliente Demo'
        }
      ];

      for (const userData of defaultUsers) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Usuario creado: ${userData.username} (${userData.userType})`);
      }
      
      console.log('🎉 Usuarios por defecto creados exitosamente');
    } else {
      console.log('✅ Los usuarios por defecto ya existen');
    }

    // Verificar siniestros existentes
    const siniestroCount = await Siniestro.countDocuments();
    console.log(`📊 Total de siniestros en la base de datos: ${siniestroCount}`);

    console.log('\n🎯 Credenciales para acceder al sistema:');
    console.log('   Admin: admin / Admin2024!');
    console.log('   Cliente: cliente / Cliente2024!');

    console.log('\n🌐 Accede a tu aplicación en:');
    console.log(`   Backend: http://localhost:${PORT}`);
    console.log(`   Frontend: http://localhost:5173`);

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

// Ejecutar la inicialización
initializeDatabase();