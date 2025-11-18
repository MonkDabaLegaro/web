#!/usr/bin/env node

/**
 * Script para insertar datos de ejemplo en la base de datos
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import Siniestro from './backend/server/models/Siniestro.js';

// Cargar variables de entorno
dotenv.config({ path: './backend/server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema_siniestros';

const siniestrosEjemplo = [
  {
    rut: '12345678-9',
    nombreCliente: 'Juan Pérez García',
    numeroPoliza: 'POL-2024-001234',
    patente: 'ABC123',
    marca: 'Toyota',
    modelo: 'Corolla',
    tipoDanio: 'Colisión',
    tipoVehiculo: 'Sedán',
    email: 'juan.perez@email.com',
    telefono: '+56912345678',
    tipoSeguro: 'Automotriz',
    estado: 'En Evaluación',
    liquidador: 'Pedro Martínez',
    grua: 'Servicio Norte',
    taller: 'Auto Fix S.A.',
    fechaRegistro: new Date('2024-11-01'),
    fechaActualizacion: new Date('2024-11-05')
  },
  {
    rut: '98765432-1',
    nombreCliente: 'María González López',
    numeroPoliza: 'POL-2024-005678',
    patente: 'XYZ789',
    marca: 'Honda',
    modelo: 'Civic',
    tipoDanio: 'Robo',
    tipoVehiculo: 'Sedán',
    email: 'maria.gonzalez@email.com',
    telefono: '+56987654321',
    tipoSeguro: 'Automotriz',
    estado: 'Finalizado',
    liquidador: 'Carlos López',
    grua: 'Transporte Rápido',
    taller: 'Carros Car',
    fechaRegistro: new Date('2024-10-15'),
    fechaActualizacion: new Date('2024-10-20')
  },
  {
    rut: '11223344-5',
    nombreCliente: 'Pedro Martínez Silva',
    numeroPoliza: 'POL-2024-009876',
    patente: 'DEF456',
    marca: 'Ford',
    modelo: 'Ranger',
    tipoDanio: 'Incendio',
    tipoVehiculo: 'Camioneta',
    email: 'pedro.martinez@email.com',
    telefono: '+56911223344',
    tipoSeguro: 'Automotriz',
    estado: 'Ingresado',
    liquidador: 'Luis Rodríguez',
    grua: 'Grúa Express',
    taller: 'Taller Central',
    fechaRegistro: new Date('2024-11-08'),
    fechaActualizacion: new Date('2024-11-08')
  },
  {
    rut: '55667788-9',
    nombreCliente: 'Ana Contreras Morales',
    numeroPoliza: 'POL-2024-001122',
    patente: 'GHI789',
    marca: 'Hyundai',
    modelo: 'Tucson',
    tipoDanio: 'Vandalismo',
    tipoVehiculo: 'SUV',
    email: 'ana.contreras@email.com',
    telefono: '+56955667788',
    tipoSeguro: 'Automotriz',
    estado: 'En Evaluación',
    liquidador: 'Ana Silva',
    grua: 'Servicio 24/7',
    taller: 'Reparación Total',
    fechaRegistro: new Date('2024-11-07'),
    fechaActualizacion: new Date('2024-11-09')
  },
  {
    rut: '33445566-7',
    nombreCliente: 'Roberto Díaz Hernández',
    numeroPoliza: 'POL-2024-003333',
    patente: 'JKL012',
    marca: 'Chevrolet',
    modelo: 'Spark',
    tipoDanio: 'Colisión',
    tipoVehiculo: 'Sedán',
    email: 'roberto.diaz@email.com',
    telefono: '+56933445566',
    tipoSeguro: 'Moto',
    estado: 'Ingresado',
    liquidador: 'Carmen Morales',
    grua: 'Auto Rescate',
    taller: 'Mecánica Rápida',
    fechaRegistro: new Date('2024-11-06'),
    fechaActualizacion: new Date('2024-11-06')
  },
  {
    rut: '77889900-1',
    nombreCliente: 'Carmen López Valenzuela',
    numeroPoliza: 'POL-2024-004444',
    patente: 'MNO345',
    marca: 'Kia',
    modelo: 'Sportage',
    tipoDanio: 'Incendio',
    tipoVehiculo: 'SUV',
    email: 'carmen.lopez@email.com',
    telefono: '+56977889900',
    tipoSeguro: 'Automotriz',
    estado: 'Finalizado',
    liquidador: 'María González',
    grua: 'Grúa Rápida Sur',
    taller: 'Taller Sur Especializado',
    fechaRegistro: new Date('2024-10-20'),
    fechaActualizacion: new Date('2024-10-25')
  },
  {
    rut: '11220033-4',
    nombreCliente: 'Miguel Ángel Rodríguez',
    numeroPoliza: 'POL-2024-005555',
    patente: 'PQR678',
    marca: 'Nissan',
    modelo: 'Altima',
    tipoDanio: 'Robo',
    tipoVehiculo: 'Sedán',
    email: 'miguel.rodriguez@email.com',
    telefono: '+56911220033',
    tipoSeguro: 'Automotriz',
    estado: 'En Evaluación',
    liquidador: 'Carlos López',
    grua: 'Grúa Central 24/7',
    taller: 'Auto Fix S.A.',
    fechaRegistro: new Date('2024-11-04'),
    fechaActualizacion: new Date('2024-11-06')
  },
  {
    rut: '55660011-2',
    nombreCliente: 'Isabel Pérez Morales',
    numeroPoliza: 'POL-2024-006666',
    patente: 'STU901',
    marca: 'Mazda',
    modelo: 'CX-5',
    tipoDanio: 'Vandalismo',
    tipoVehiculo: 'SUV',
    email: 'isabel.perez@email.com',
    telefono: '+56955660011',
    tipoSeguro: 'Automotriz',
    estado: 'Ingresado',
    liquidador: 'Pedro Martínez',
    grua: 'Grúa Oriente',
    taller: 'Taller Norte Premium',
    fechaRegistro: new Date('2024-11-09'),
    fechaActualizacion: new Date('2024-11-09')
  }
];

async function insertarDatosEjemplo() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB exitosamente');

    // Verificar si ya existen siniestros
    const countExistente = await Siniestro.countDocuments();
    console.log(`Total de siniestros existentes: ${countExistente}`);

    if (countExistente > 0) {
      console.log('Ya existen siniestros en la base de datos.');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const respuesta = await new Promise((resolve) => {
        rl.question('¿Deseas agregar más siniestros de ejemplo? (s/n): ', (answer) => {
          rl.close();
          resolve(answer.toLowerCase());
        });
      });
      
      if (respuesta !== 's' && respuesta !== 'si') {
        console.log('Operación cancelada.');
        return;
      }
    }

    // Insertar siniestros de ejemplo
    console.log('\nInsertando siniestros de ejemplo...');
    
    for (let i = 0; i < siniestrosEjemplo.length; i++) {
      const siniestro = new Siniestro(siniestrosEjemplo[i]);
      await siniestro.save();
      console.log(`Siniestro ${i + 1}/${siniestrosEjemplo.length} creado: ${siniestro.nombreCliente} (${siniestro.patente}) - ${siniestro.estado}`);
    }

    // Verificar inserción
    const nuevoCount = await Siniestro.countDocuments();
    console.log(`\n¡Datos de ejemplo insertados exitosamente!`);
    console.log(`Total de siniestros ahora: ${nuevoCount}`);

    // Mostrar estadísticas por estado
    const estados = await Siniestro.aggregate([
      { $group: { _id: '$estado', count: { $sum: 1 } } }
    ]);

    console.log('\nEstadísticas por estado:');
    estados.forEach(estado => {
      console.log(`   ${estado._id}: ${estado.count} siniestros`);
    });

    // Mostrar estadísticas por tipo de daño
    const tiposDanio = await Siniestro.aggregate([
      { $group: { _id: '$tipoDanio', count: { $sum: 1 } } }
    ]);

    console.log('\nEstadísticas por tipo de daño:');
    tiposDanio.forEach(tipo => {
      console.log(`   ${tipo._id}: ${tipo.count} siniestros`);
    });

    console.log('\nAccede a tu aplicación:');
    console.log(`   Frontend: http://localhost:5173`);
    console.log(`   Dashboard Admin: http://localhost:5173/admin`);
    console.log(`   Reportes: http://localhost:5173/reporte`);

  } catch (error) {
    console.error('Error al insertar datos de ejemplo:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nConexión a MongoDB cerrada');
  }
}

// Ejecutar la inserción
insertarDatosEjemplo();