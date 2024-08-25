function formatearNumero(numero) {
  const formato = new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formato.format(numero);
}
