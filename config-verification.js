#!/usr/bin/env node

/**
 * Módulo de verificación completa de configuración del sistema
 * Verifica todos los prerrequisitos antes de iniciar los servicios
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/server/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar variables de entorno
dotenv.config();

// Timeout para operaciones (en ms)
const TIMEOUT = 10000;

/**
 * Función auxiliar para ejecutar comandos con timeout
 */
function execWithTimeout(command, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout ejecutando comando: ${command}`));
    }, TIMEOUT);

    try {
      const result = execSync(command, { ...options, encoding: 'utf8' });
      clearTimeout(timeout);
      resolve(result);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

/**
 * Verificación 1: Node.js instalado
 */
async function verifyNodeJS() {
  try {
    const nodeVersion = await execWithTimeout('node --version');
    console.log(`[OK] Node.js encontrado: ${nodeVersion.trim()}`);
    return true;
  } catch (error) {
    throw new Error('Node.js no está instalado o no está en el PATH. Instala Node.js desde https://nodejs.org');
  }
}

/**
 * Verificación 2: MongoDB ejecutándose
 */
async function verifyMongoDB() {
  const isWindows = process.platform === 'win32';
  let mongoRunning = false;

  try {
    if (isWindows) {
      await execWithTimeout('tasklist /FI "IMAGENAME eq mongod.exe" /NH');
      mongoRunning = true;
    } else {
      try {
        await execWithTimeout('pgrep mongod');
        mongoRunning = true;
      } catch {
        const psOutput = await execWithTimeout('ps aux | grep mongod | grep -v grep');
        mongoRunning = psOutput.trim() !== '';
      }
    }

    if (mongoRunning) {
      console.log('[OK] MongoDB está ejecutándose');
      return true;
    } else {
      throw new Error('MongoDB not running');
    }
  } catch (error) {
    throw new Error('MongoDB no está ejecutándose. Inicia MongoDB: Windows (servicio automático), macOS (brew services start mongodb-community), Linux (sudo systemctl start mongod)');
  }
}

/**
 * Verificación 3: Dependencias instaladas
 */
async function verifyDependencies() {
  const backendPath = path.join(__dirname, 'backend', 'server');
  const frontendPath = path.join(__dirname, 'frontend');

  // Verificar backend
  try {
    if (!fs.existsSync(path.join(backendPath, 'node_modules'))) {
      throw new Error('node_modules no encontrado en backend');
    }
    await execWithTimeout('npm list --depth=0', { cwd: backendPath });
    console.log('[OK] Dependencias del backend instaladas');
  } catch (error) {
    throw new Error(`Dependencias del backend no instaladas. Ejecuta 'npm install' en ${backendPath}`);
  }

  // Verificar frontend
  try {
    if (!fs.existsSync(path.join(frontendPath, 'node_modules'))) {
      throw new Error('node_modules no encontrado en frontend');
    }
    await execWithTimeout('npm list --depth=0', { cwd: frontendPath });
    console.log('[OK] Dependencias del frontend instaladas');
  } catch (error) {
    throw new Error(`Dependencias del frontend no instaladas. Ejecuta 'npm install' en ${frontendPath}`);
  }

  return true;
}

/**
 * Verificación 4: Archivo .env existe y es válido
 */
async function verifyEnvFile() {
  const backendEnvPath = path.join(__dirname, 'backend', 'server', '.env');
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

  const requiredBackendVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'FRONTEND_URL'];
  const requiredFrontendVars = ['VITE_API_BASE_URL']; // Asumiendo que hay una variable para la API

  // Verificar backend .env
  try {
    if (!fs.existsSync(backendEnvPath)) {
      throw new Error('.env no encontrado en backend');
    }

    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    for (const varName of requiredBackendVars) {
      if (!envVars[varName]) {
        throw new Error(`Variable ${varName} no encontrada en .env del backend`);
      }
    }

    console.log('[OK] Archivo .env del backend válido');
  } catch (error) {
    throw new Error(`Archivo .env del backend inválido: ${error.message}. Copia config.env.example a .env y configura las variables`);
  }

  // Verificar frontend .env (si existe)
  try {
    if (fs.existsSync(frontendEnvPath)) {
      const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
      const envVars = {};

      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      });

      for (const varName of requiredFrontendVars) {
        if (!envVars[varName]) {
          throw new Error(`Variable ${varName} no encontrada en .env del frontend`);
        }
      }

      console.log('[OK] Archivo .env del frontend válido');
    } else {
      console.log('[INFO] Archivo .env del frontend no encontrado (opcional)');
    }
  } catch (error) {
    throw new Error(`Archivo .env del frontend inválido: ${error.message}`);
  }

  return true;
}

/**
 * Verificación 5: Configuración CORS
 */
async function verifyCORS() {
  const backendEnvPath = path.join(__dirname, 'backend', 'server', '.env');

  try {
    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    const hasFrontendUrl = envContent.includes('FRONTEND_URL=');

    if (!hasFrontendUrl) {
      throw new Error('FRONTEND_URL no configurada en .env');
    }

    console.log('[OK] Configuración CORS verificada');
    return true;
  } catch (error) {
    throw new Error(`Configuración CORS inválida: ${error.message}. Asegúrate de que FRONTEND_URL esté configurada en .env`);
  }
}

/**
 * Verificación 6: Usuarios por defecto en la base de datos
 */
async function verifyAndCreateDefaultUsers() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema_siniestros';

  try {
    console.log('Conectando a MongoDB para verificar usuarios...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB exitosamente');

    // Verificar usuarios existentes
    const userCount = await User.countDocuments();
    console.log(`Total de usuarios en la base de datos: ${userCount}`);

    // Crear usuarios por defecto si no existen
    if (userCount === 0) {
      console.log('Creando usuarios por defecto...');

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
        console.log(`Usuario creado: ${userData.username} (${userData.userType})`);
      }

      console.log('Usuarios por defecto creados exitosamente');
    } else {
      console.log('Los usuarios por defecto ya existen');
    }

    console.log('[OK] Verificación de usuarios completada');
    return true;
  } catch (error) {
    throw new Error(`Error verificando/creando usuarios por defecto: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
  }
}

/**
 * Verificación 7: Health check de la API del backend
 */
async function verifyAPIHealth() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout en health check de la API'));
    }, TIMEOUT);

    const url = 'http://localhost:3001/api/health';
    const req = http.get(url, (res) => {
      clearTimeout(timeout);
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.message && response.message.includes('funcionando correctamente')) {
            console.log('[OK] Health check de la API exitoso');
            resolve(true);
          } else {
            reject(new Error('Respuesta de health check inválida'));
          }
        } catch (error) {
          reject(new Error('Error parseando respuesta del health check'));
        }
      });
    });

    req.on('error', (error) => {
      clearTimeout(timeout);
      reject(new Error('No se pudo conectar a la API. Asegúrate de que el backend esté ejecutándose'));
    });

    req.setTimeout(TIMEOUT, () => {
      req.destroy();
      reject(new Error('Timeout conectando a la API'));
    });
  });
}

/**
 * Función principal de verificación
 * @param {boolean} includeHealthCheck - Si incluir verificación de health check de API
 */
export async function verifyConfiguration(includeHealthCheck = false) {
  console.log('===============================================');
  console.log('   VERIFICACIÓN DE CONFIGURACIÓN DEL SISTEMA');
  console.log('===============================================');
  console.log();

  const checks = [
    { name: 'Node.js', func: verifyNodeJS },
    { name: 'MongoDB', func: verifyMongoDB },
    { name: 'Usuarios por defecto', func: verifyAndCreateDefaultUsers },
    { name: 'Dependencias', func: verifyDependencies },
    { name: 'Archivo .env', func: verifyEnvFile },
    { name: 'Configuración CORS', func: verifyCORS }
  ];

  if (includeHealthCheck) {
    checks.push({ name: 'Health check API', func: verifyAPIHealth });
  }

  for (const check of checks) {
    try {
      console.log(`Verificando ${check.name}...`);
      await check.func();
      console.log();
    } catch (error) {
      console.error(`[ERROR] ${check.name}: ${error.message}`);
      console.log();
      throw error;
    }
  }

  console.log('===============================================');
  console.log('   TODAS LAS VERIFICACIONES PASARON EXITOSAMENTE');
  console.log('===============================================');
  console.log();
}

/**
 * Función para ejecutar verificación desde línea de comandos
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyConfiguration()
    .then(() => {
      console.log('Configuración verificada correctamente.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en verificación de configuración:', error.message);
      process.exit(1);
    });
}