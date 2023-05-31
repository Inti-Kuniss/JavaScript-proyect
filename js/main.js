// Función asincrónica para consultar la suma asegurada
async function consultarSA(marca, modelo, version, ano) {
  try {
    // Obtener el archivo JSON de vehículos
    const response = await fetch('./vehiculos.json');

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('Error al cargar el archivo JSON.');
    }

    // Obtener el JSON como un array
    const jsonArray = await response.json();

    // Filtrar los vehículos por marca, modelo, versión y año
    const vehiculosPorAno = jsonArray.filter(el =>
      el.MARCA === marca &&
      el.MODELO === modelo &&
      el.VERSION === version &&
      el.ANO === ano
    );

    // Obtener la suma asegurada del primer vehículo coincidente (si existe)
    const sumaAsegurada = vehiculosPorAno[0]?.SA;

    return sumaAsegurada;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Obtener el formulario y establecer variables de seguimiento
const formulario = document.getElementById("formulario");
let divPrevio = null;
let divCotizacionesHistoricasPrevio = null;

// Manejador de eventos para el envío del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Eliminar la cotización anterior (si existe)
  if (divPrevio) {
    divPrevio.remove();
  }

  // Eliminar las cotizaciones históricas anteriores (si existen)
  if (divCotizacionesHistoricasPrevio) {
    divCotizacionesHistoricasPrevio.remove();
  }

  // Obtener los valores del formulario
  const { nombre, apellido, marca, modelo, version, ano } = e.target.elements;
  const nombreCompleto = `${nombre.value} ${apellido.value}`;

  // Consultar la suma asegurada
  const sa = await consultarSA(marca.value, modelo.value, version.value, parseInt(ano.value));

  // Obtener las cotizaciones históricas almacenadas en sessionStorage o un array vacío
  const cotizacionesHistoricas = JSON.parse(sessionStorage.getItem("cotizacionesHistoricas")) || [];

  // Crear el objeto de la cotización actual
  const cotizacionActual = {
    nombreCompleto,
    marca: marca.value,
    modelo: modelo.value,
    version: version.value,
    ano: parseInt(ano.value),
    sumaAsegurada: sa
  };

  // Mostrar la cotización actual en el DOM
  const divCotizacionActual = document.createElement("div");
  divCotizacionActual.innerHTML = `
    <h1>Tus datos:</h1>
    <p>Nombre completo: ${nombreCompleto}</p>
    <p>Marca: ${marca.value}</p>
    <p>Modelo: ${modelo.value}</p>
    <p>Versión: ${version.value}</p>
    <p>Año: ${ano.value}</p>
    <p>Suma asegurada: $${sa?.toLocaleString()}</p>
  `;
  document.body.append(divCotizacionActual);
  divPrevio = divCotizacionActual;

  // Agregar la cotización actual al array de cotizaciones históricas
  cotizacionesHistoricas.push(cotizacionActual);
  sessionStorage.setItem("cotizacionesHistoricas", JSON.stringify(cotizacionesHistoricas));

  // Mostrar las cotizaciones históricas en el DOM
  const divCotizacionesHistoricas = document.createElement("div");
  divCotizacionesHistoricas.innerHTML = "<h2>Cotizaciones Históricas:</h2>";

  // Recorrer las cotizaciones históricas (excluyendo la cotización actual) y mostrarlas en el DOM
  cotizacionesHistoricas.slice(0, -1).forEach((cotizacion, index) => {
    const divCotizacion = document.createElement("div");
    divCotizacion.innerHTML = `
      <h3>Cotización ${index + 1}:</h3>
      <p>Nombre completo: ${cotizacion.nombreCompleto}</p>
      <p>Marca: ${cotizacion.marca}</p>
      <p>Modelo: ${cotizacion.modelo}</p>
      <p>Versión: ${cotizacion.version}</p>
      <p>Año: ${cotizacion.ano}</p>
      <p>Suma asegurada: $${cotizacion.sumaAsegurada?.toLocaleString()}</p>
    `;
    divCotizacionesHistoricas.append(divCotizacion);
  });

  document.body.append(divCotizacionesHistoricas);
  divCotizacionesHistoricasPrevio = divCotizacionesHistoricas;
});