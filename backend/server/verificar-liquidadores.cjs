// Script para verificar y limpiar liquidadores en la base de datos

const mongoose = require('mongoose');

// Importar el modelo de Siniestro
const SiniestroSchema = new mongoose.Schema({
  rut: String,
  nombreCliente: String,
  numeroPoliza: String,
  patente: String,
  marca: String,
  modelo: String,
  tipoDanio: String,
  tipoVehiculo: String,
  email: String,
  telefono: String,
  tipoSeguro: String,
  fechaRegistro: Date,
  fechaActualizacion: Date,
  estado: String,
  liquidador: String,
  grua: String,
  taller: String
}, {
  timestamps: true
});

const Siniestro = mongoose.model('Siniestro', SiniestroSchema);

async function verificarYLimpiarLiquidadores() {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/sistema_siniestros');
    console.log('Conectado a MongoDB');

    // Obtener todos los liquidadores únicos en la base de datos
    const liquidadoresEnDB = await Siniestro.distinct('liquidador');
    console.log(`\nTotal de liquidadores encontrados en la base de datos: ${liquidadoresEnDB.length}`);
    
    // Lista de los 6 liquidadores válidos
    const liquidadoresValidos = [
      'María González',
      'Carlos López',
      'Ana Silva',
      'Pedro Martínez', 
      'Luis Rodríguez',
      'Carmen Morales'
    ];

    console.log('\n=== LIQUIDADORES VÁLIDOS (6) ===');
    liquidadoresValidos.forEach((liquidador, index) => {
      console.log(`${index + 1}. ${liquidador}`);
    });

    console.log('\n=== LIQUIDADORES EN LA BASE DE DATOS ===');
    for (const liquidador of liquidadoresEnDB) {
      if (liquidador) { // Verificar que no sea null/undefined
        const count = await Siniestro.countDocuments({ liquidador });
        const esValido = liquidadoresValidos.includes(liquidador);
        console.log(`${liquidadoresEnDB.indexOf(liquidador) + 1}. ${liquidador} (${count} siniestros) - ${esValido ? 'VÁLIDO' : 'INVÁLIDO'}`);
      }
    }

    // Identificar liquidadores inválidos
    const liquidadoresInvalidos = liquidadoresEnDB.filter(l => l && !liquidadoresValidos.includes(l));
    
    if (liquidadoresInvalidos.length > 0) {
      console.log('\n=== LIQUIDADORES INVÁLIDOS A ELIMINAR ===');
      
      for (const liquidador of liquidadoresInvalidos) {
        const count = await Siniestro.countDocuments({ liquidador });
        console.log(`- ${liquidador}: ${count} siniestros`);
        
        // Eliminar siniestros con liquidadores inválidos
        const resultado = await Siniestro.deleteMany({ liquidador });
        console.log(`  ✓ Eliminados ${resultado.deletedCount} registros`);
      }
      
      console.log('\n✅ Base de datos limpiada. Solo quedan los 6 liquidadores válidos.');
    } else {
      console.log('\n✅ No se encontraron liquidadores inválidos. La base de datos ya está limpia.');
    }

    // Verificación final
    const liquidadoresFinales = await Siniestro.distinct('liquidador');
    console.log('\n=== VERIFICACIÓN FINAL ===');
    console.log(`Total de liquidadores únicos: ${liquidadoresFinales.length}`);
    
    const resumenEstadisticas = await Siniestro.aggregate([
      {
        $group: {
          _id: '$liquidador',
          total: { $sum: 1 }
        }
      }
    ]);

    console.log('\nEstadísticas finales por liquidador:');
    resumenEstadisticas.forEach((stat, index) => {
      if (stat._id) { // Verificar que no sea null
        console.log(`${index + 1}. ${stat._id}: ${stat.total} siniestros`);
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
  }
}

// Ejecutar la función
verificarYLimpiarLiquidadores();