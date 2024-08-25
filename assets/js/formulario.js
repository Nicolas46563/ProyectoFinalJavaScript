document.addEventListener("DOMContentLoaded", function() {
  const btnCalcular = document.getElementById("btnCalcular");
  const btnLimpiar = document.getElementById("btnLimpiar");

  // Eventos
  btnCalcular.addEventListener("click", calcularInversion);
  btnLimpiar.addEventListener("click", limpiarFormulario);

  // Cargar datos de frecuencia
  cargarDatosDesdeJSON();

  // Captura el nombre del usuario y configura el estado inicial
  capturarNombreUsuario();
  cargarEstadoInicial();

  // Eventos de cambio en los campos de entrada
  document.querySelectorAll('#formulario input, #formulario select').forEach(input => {
    input.addEventListener('change', guardarEstadoFormulario);
  });
});

function cargarDatosDesdeJSON() {
  fetch('json/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const selectFrecuencia = document.getElementById('frecuenciaCapitalizacion');
      data.frecuencias.forEach(frecuencia => {
        const option = document.createElement('option');
        option.value = frecuencia.valor;
        option.textContent = frecuencia.texto;
        selectFrecuencia.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar datos:', error);
    });
}

function capturarNombreUsuario() {
  let nombre = localStorage.getItem('nombreUsuario');
  
  // Repetir hasta que el usuario ingrese un nombre válido
  while (!nombre) {
    nombre = prompt("Por favor, ingrese su nombre:");
    
    if (nombre) {
      localStorage.setItem('nombreUsuario', nombre);
    } else {
      alert("El nombre es obligatorio. Por favor, ingrese su nombre.");
    }
  }

  const tituloBienvenida = document.getElementById("bienvenida");
  tituloBienvenida.textContent = `Hola ${nombre}, bienvenido a la Calculadora de Inversiones`;
}

function notificarUsuario(mensaje, tipo = "info") {
  Swal.fire({
    icon: tipo,
    title: mensaje,
    showConfirmButton: true,
    timer: tipo === "success" ? 2000 : undefined, // Muestra el botón de confirmación solo para notificaciones de error
  });
}


function limpiarFormulario() {
  const formulario = document.getElementById("formulario");
  formulario.classList.add('animate__animated', 'animate__fadeOut');

  setTimeout(() => {
    formulario.reset();
    document.getElementById("montoFinal").textContent = '';
    document.getElementById("interesesGanados").textContent = '';
    document.getElementById("notificaciones").innerHTML = '';
    notificarUsuario("Formulario limpiado.", "info");
    localStorage.removeItem('estadoFormulario');
    formulario.classList.remove('animate__animated', 'animate__fadeOut');
  }, 1000); // Duración de la animación
}


function guardarEstadoFormulario() {
  const estadoFormulario = {
    montoInicial: document.getElementById('montoInicial').value,
    tasaAnual: document.getElementById('tasaAnual').value,
    plazo: document.getElementById('plazo').value,
    frecuenciaCapitalizacion: document.getElementById('frecuenciaCapitalizacion').value,
  };
  localStorage.setItem('estadoFormulario', JSON.stringify(estadoFormulario));
}

function cargarEstadoInicial() {
  const estadoFormulario = JSON.parse(localStorage.getItem('estadoFormulario'));
  if (estadoFormulario) {
    document.getElementById('montoInicial').value = estadoFormulario.montoInicial;
    document.getElementById('tasaAnual').value = estadoFormulario.tasaAnual;
    document.getElementById('plazo').value = estadoFormulario.plazo;
    document.getElementById('frecuenciaCapitalizacion').value = estadoFormulario.frecuenciaCapitalizacion;
  }
}

function calcularInversion() {
  const montoInicial = parseFloat(document.getElementById('montoInicial').value);
  const tasaAnual = parseFloat(document.getElementById('tasaAnual').value);
  const plazo = parseFloat(document.getElementById('plazo').value);
  const frecuencia = document.getElementById('frecuenciaCapitalizacion').value;

  if (isNaN(montoInicial) || isNaN(tasaAnual) || isNaN(plazo)) {
    notificarUsuario("Por favor, ingrese valores válidos en todos los campos.", "error");
    return;
  }

  // Añadir animación al botón
  const btnCalcular = document.getElementById('btnCalcular');
  btnCalcular.classList.add('animate__animated', 'animate__bounce');

  // Remover la animación después de que se haya completado
  setTimeout(() => {
    btnCalcular.classList.remove('animate__animated', 'animate__bounce');
  }, 1000);

  const inversion = new Inversion(montoInicial, tasaAnual, plazo, frecuencia);
  const resultado = inversion.calcularInversion();

  if (resultado) {
    // Aplicar animación a los resultados
    document.getElementById("montoFinal").classList.add('animate__animated', 'animate__fadeIn');
    document.getElementById("interesesGanados").classList.add('animate__animated', 'animate__fadeIn');

    document.getElementById("montoFinal").textContent = resultado.montoFinal;
    document.getElementById("interesesGanados").textContent = resultado.interesesGanados;
    notificarUsuario("Cálculo realizado con éxito.", "success");

    // Mostrar mensaje dinámico
    mostrarNotificacion("Cálculo realizado con éxito.", "success");

    // Remover la animación después de que se haya completado
    setTimeout(() => {
      document.getElementById("montoFinal").classList.remove('animate__animated', 'animate__fadeIn');
      document.getElementById("interesesGanados").classList.remove('animate__animated', 'animate__fadeIn');
    }, 1000);
  }
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  const contenedor = document.getElementById('notificaciones');
  const notificacion = document.createElement('div');
  notificacion.textContent = mensaje;
  notificacion.classList.add('notificacion', tipo);

  // Agregar la notificación al contenedor
  contenedor.appendChild(notificacion);

  // Eliminar la notificación después de unos segundos
  setTimeout(() => {
    notificacion.classList.add('hide');
    setTimeout(() => notificacion.remove(), 300); // Elimina el elemento después de la animación de ocultamiento
  }, 5000);
}

function guardarResultado(montoFinal, interesesGanados) {
  const resultado = {
    montoFinal: formatearNumero(montoFinal),
    interesesGanados: formatearNumero(interesesGanados),
  };
  localStorage.setItem('ultimoResultado', JSON.stringify(resultado));
}
