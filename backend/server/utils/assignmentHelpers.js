// Utilidades para asignación automática de recursos

// Asignar liquidador aleatorio
export function assignLiquidador() {
  const liquidadores = [
    'María González',
    'Carlos López',
    'Ana Silva',
    'Pedro Martínez',
    'Luis Rodríguez',
    'Carmen Morales'
  ];
  return liquidadores[Math.floor(Math.random() * liquidadores.length)];
}

// Asignar grúa aleatoria
export function assignGrua() {
  const gruas = [
    'Grúa Express Norte',
    'Grúa Rápida Sur',
    'Grúa Central 24/7',
    'Grúa Metropolitana',
    'Grúa Oriente'
  ];
  return gruas[Math.floor(Math.random() * gruas.length)];
}

// Asignar taller aleatorio
export function assignTaller() {
  const talleres = [
    'Taller Mecánico ABC',
    'Taller Automotriz Pro',
    'Taller Central Motors',
    'Taller Sur Especializado',
    'Taller Norte Premium'
  ];
  return talleres[Math.floor(Math.random() * talleres.length)];
}

// Asignar todos los recursos automáticamente
export function assignAllResources() {
  return {
    liquidador: assignLiquidador(),
    grua: assignGrua(),
    taller: assignTaller()
  };
}