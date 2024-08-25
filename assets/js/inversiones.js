class Inversion {
  constructor(montoInicial, tasaAnual, plazo, frecuencia) {
    this.montoInicial = montoInicial;
    this.tasaAnual = tasaAnual / 100;
    this.plazo = plazo;
    this.frecuencia = frecuencia;
    this.frecuenciaCapitalizacion = this.calcularFrecuenciaCapitalizacion(frecuencia);
  }

  calcularFrecuenciaCapitalizacion(frecuencia) {
    switch (frecuencia) {
      case "anual":
        return 1;
      case "semestral":
        return 2;
      case "mensual":
        return 12;
      default:
        notificarUsuario("Frecuencia de capitalización no válida.", "error");
        return 0;
    }
  }

  calcularInversion() {
    if (this.frecuenciaCapitalizacion === 0) {
      return null;
    }

    const totalPeriodos = this.plazo * this.frecuenciaCapitalizacion;
    const tasaPeriodica = this.tasaAnual / this.frecuenciaCapitalizacion;

    let montoActual = this.montoInicial;
    let interesesGanados = 0;

    for (let i = 0; i < totalPeriodos; i++) {
      let interesesPeriodo = montoActual * tasaPeriodica;
      interesesGanados += interesesPeriodo;
      montoActual += interesesPeriodo;
    }

    return {
      montoFinal: formatearNumero(montoActual),
      interesesGanados: formatearNumero(interesesGanados),
    };
  }
}
