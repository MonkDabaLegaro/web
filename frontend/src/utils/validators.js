export function validarRUT(rut) {
  rut = rut.replace(/\s/g, '').replace(/\./g, '');
  const regex = /^(\d{7,8})-([\dKk])$/;

  if (!regex.test(rut)) {
    return false;
  }

  const [numero, digitoVerificador] = rut.split('-');
  const rutNumerico = numero.split('').reverse().map(Number);
  let multiplicador = 2;
  let suma = 0;

  for (const digito of rutNumerico) {
    suma += digito * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const digitoCalculado = 11 - resto;

  let digitoEsperado;
  if (digitoCalculado === 11) {
    digitoEsperado = '0';
  } else if (digitoCalculado === 10) {
    digitoEsperado = 'K';
  } else {
    digitoEsperado = digitoCalculado.toString();
  }

  return digitoEsperado === digitoVerificador.toUpperCase();
}

export function formatearRUT(rut) {
  rut = rut.replace(/\s/g, '');
  const regex = /^(\d+)-([\dKk])$/;
  const match = rut.match(regex);
  if (!match) return rut;
  return `${match[1]}-${match[2].toUpperCase()}`;
}

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarTelefono(telefono) {
  const regex = /^\+56\s?9\s?\d{4}\s?\d{4}$/;
  return regex.test(telefono);
}

export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatearFechaHora(fecha) {
  return new Date(fecha).toLocaleString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
