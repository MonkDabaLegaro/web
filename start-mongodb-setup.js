#!/usr/bin/env node

/**
 * Script de configuración inicial para MongoDB
 * Este script ayuda a configurar el entorno de desarrollo
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Configurando Sistema de Siniestros con MongoDB...\n');

// Verificar si Node.js está instalado
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js detectado: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js no está instalado. Por favor instala Node.js primero.');
  process.exit(1);
}

// Verificar si MongoDB está ejecutándose
try {
  execSync('mongosh --eval "db.adminCommand(\'ismaster\')"', { encoding: 'utf8' });
  console.log('✅ MongoDB está ejecutándose');
} catch (error) {
  console.log('⚠️  MongoDB no está ejecutándose. Por favor inicia MongoDB primero.');
  console.log('   En Windows: MongoDB se inicia automáticamente como servicio');
  console.log('   En macOS: brew services start mongodb/brew/mongodb-community');
  console.log('   En Linux: sudo systemctl start mongod');
}

// Verificar si el directorio server existe
if (!fs.existsSync('server')) {
  console.log('❌ Directorio server no encontrado. Asegúrate de estar en el directorio raíz del proyecto.');
  process.exit(1);
}

// Instalar dependencias del backend
console.log('\n📦 Instalando dependencias del backend...');
try {
  execSync('npm install', { cwd: 'server', stdio: 'inherit' });
  console.log('✅ Dependencias del backend instaladas');
} catch (error) {
  console.error('❌ Error al instalar dependencias del backend:', error.message);
  process.exit(1);
}

// Verificar si existe el archivo .env
const envPath = path.join('server', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n⚙️  Creando archivo de configuración...');
  
  const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sistema_siniestros

# JWT Secret (cambiar por una clave segura en producción)
JWT_SECRET=mi_jwt_secret_super_seguro_para_desarrollo_12345

# Server Configuration
PORT=3001

# CORS Configuration
FRONTEND_URL=http://localhost:5173
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado en server/.env');
} else {
  console.log('✅ Archivo .env ya existe');
}

// Instalar dependencias del frontend
console.log('\n📦 Instalando dependencias del frontend...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencias del frontend instaladas');
} catch (error) {
  console.error('❌ Error al instalar dependencias del frontend:', error.message);
  process.exit(1);
}

console.log('\n🎉 ¡Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Inicia el servidor backend:');
console.log('   cd server && npm run dev');
console.log('\n2. En otra terminal, inicia el frontend:');
console.log('   npm run dev');
console.log('\n3. Crea los usuarios por defecto:');
console.log('   curl -X POST http://localhost:3001/api/auth/create-default-users');
console.log('\n4. Accede a la aplicación:');
console.log('   http://localhost:5173');
console.log('\n5. Usa las credenciales:');
console.log('   Admin: admin / 1234');
console.log('   Cliente: cliente / 5678');
console.log('\n📚 Para más información, consulta MONGODB_SETUP.md');
