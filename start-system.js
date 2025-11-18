#!/usr/bin/env node

/**
 * Script cross-platform para iniciar el sistema de siniestros
 * Equivalente a iniciar-sistema.bat pero compatible con Windows, macOS y Linux
 */

import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyConfiguration, verifyAPIHealth } from './config-verification.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('===============================================');
console.log('   SISTEMA DE DESARROLLO - CONTROL DE SINIESTROS');
console.log('===============================================');
console.log();
console.log('Iniciando servicios del sistema...');
console.log();

// Ejecutar verificación completa de configuración
try {
  await verifyConfiguration(false); // Sin health check, ya que backend no está iniciado
} catch (error) {
  console.error('ERROR: Falló la verificación de configuración');
  process.exit(1);
}

// Iniciar Backend
console.log('Iniciando Backend (Puerto 3001)...');
const backendProcess = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend', 'server'),
  stdio: 'inherit',
  shell: true
});

backendProcess.on('error', (error) => {
  console.error('Error al iniciar el backend:', error);
});

// Esperar un momento para que el backend inicie
setTimeout(async () => {
  // Verificar health check de la API
  try {
    console.log('Verificando health check de la API...');
    await verifyAPIHealth();
    console.log();
  } catch (error) {
    console.error('ERROR: Health check de la API falló:', error.message);
    console.log('El backend puede no estar funcionando correctamente.');
    // No salir, continuar con frontend
  }

  // Iniciar Frontend
  console.log('Iniciando Frontend (Puerto 5173)...');
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
  });

  frontendProcess.on('error', (error) => {
    console.error('Error al iniciar el frontend:', error);
  });

  console.log();
  console.log('===============================================');
  console.log('   SERVICIOS INICIADOS EXITOSAMENTE');
  console.log('===============================================');
  console.log();
  console.log('Backend:    http://localhost:3001');
  console.log('Frontend:   http://localhost:5173');
  console.log();
  console.log('IMPORTANTE:');
  console.log('- No cierres esta ventana hasta que hayas terminado de usar el sistema');
  console.log('- Para cerrar el sistema, presiona Ctrl+C aquí');
  console.log();
  console.log('Presiona Ctrl+C para detener los servicios...');

  // Mantener el proceso vivo
  process.on('SIGINT', () => {
    console.log('\nDeteniendo servicios...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });

}, 3000);