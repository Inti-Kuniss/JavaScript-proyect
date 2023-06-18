const formulario = document.getElementById("formulario");
const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const versionSelect = document.getElementById("version");
const anoSelect = document.getElementById("ano");
let divPrevio = null;
let divCotizacionesHistoricasPrevio = null;

const coeficientesCompania = {
  A: 0.8,
  B: 1.2,
  C: 0.9,
};

async function consultarSA(marca, modelo, version, ano) {
  try {
    const response = await fetch('./json/vehiculos.json');
    if (!response.ok) {
      throw new Error('Error al cargar el archivo JSON.');
    }
    const jsonArray = await response.json();
    const vehiculoEncontrado = jsonArray.find(el =>
      el.MARCA === marca &&
      el.MODELO === modelo &&
      el.VERSION === version &&
      el.ANO === ano
    );
    return vehiculoEncontrado?.SA;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function cargarOpciones(selectElement, options) {
  selectElement.innerHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
}

async function cargarOpcionesDeVehiculos() {
  try {
    const response = await fetch('./json/vehiculos.json');
    if (!response.ok) {
      throw new Error('Error al cargar el archivo JSON.');
    }
    const jsonArray = await response.json();
    const marcasUnicas = [...new Set(jsonArray.map(vehiculo => vehiculo.MARCA))];
    cargarOpciones(marcaSelect, marcasUnicas);

    marcaSelect.addEventListener("change", () => {
      const selectedMarca = marcaSelect.value;
      const modelosUnicos = [...new Set(jsonArray.filter(vehiculo => vehiculo.MARCA === selectedMarca).map(vehiculo => vehiculo.MODELO))];
      if (modelosUnicos.length > 0) {
        cargarOpciones(modeloSelect, modelosUnicos);
        versionSelect.innerHTML = '';
        anoSelect.innerHTML = '';
      } else {
        modeloSelect.innerHTML = '';
        versionSelect.innerHTML = '';
        anoSelect.innerHTML = '';
      }
    });

    modeloSelect.addEventListener("change", () => {
      const selectedMarca = marcaSelect.value;
      const selectedModelo = modeloSelect.value;
      const versionesUnicas = [...new Set(jsonArray.filter(vehiculo => vehiculo.MARCA === selectedMarca && vehiculo.MODELO === selectedModelo).map(vehiculo => vehiculo.VERSION))];
      if (versionesUnicas.length > 0) {
        cargarOpciones(versionSelect, versionesUnicas);
        anoSelect.innerHTML = '';
      } else {
        versionSelect.innerHTML = '';
        anoSelect.innerHTML = '';
      }
    });

    versionSelect.addEventListener("change", () => {
      const selectedMarca = marcaSelect.value;
      const selectedModelo = modeloSelect.value;
      const selectedVersion = versionSelect.value;
      const anosUnicos = [...new Set(jsonArray.filter(vehiculo => vehiculo.MARCA === selectedMarca && vehiculo.MODELO === selectedModelo && vehiculo.VERSION === selectedVersion).map(vehiculo => vehiculo.ANO))];
      if (anosUnicos.length > 0) {
        cargarOpciones(anoSelect, anosUnicos);
      } else {
        anoSelect.innerHTML = '';
      }
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
}

cargarOpcionesDeVehiculos();

function calcularCotizacion(edad, sumaAsegurada, coeficiente) {
  const cotizacion = (edad / 100 + 1) * (sumaAsegurada / 1000) * coeficiente;
  return parseFloat(cotizacion.toFixed(2));
}

function obtenerCotizacionesHistoricas() {
  return JSON.parse(sessionStorage.getItem("cotizacionesHistoricas")) || [];
}

function createCotizacionElement(cotizacion, nombreCompleto, edad, cp, marca, modelo, version, ano, sa) {
  const divCotizacion = document.createElement("div");
  divCotizacion.classList.add("cotizacion-card"); // Agrega la clase "cotizacion-card" al elemento div
  divCotizacion.innerHTML = ` 
    <article>
      <img class="datos-personales-icon" src="./icons/cara-feliz.png">
      <h2>Tus datos:</h2>
      <p>Nombre completo: ${nombreCompleto}</p>
      <p>Edad: ${edad}</p>
      <p>Código postal: ${cp}</p>
    </article>
    <article>
      <img class="datos-vehiculo-icon" src="./icons/vehiculo.png">
      <h2>Tu vehículo:</h2>
      <p>Marca: ${marca}</p>
      <p>Modelo: ${modelo}</p>
      <p>Versión: ${version}</p>
      <p>Año: ${ano}</p>
      <p>Suma asegurada: $${sa?.toLocaleString()}</p>
    </article>
    <article class="companias-cotizaciones">
    <img class="companias-cotizaciones-icon" src="./icons/empresa.png">
    <h2>Tu cotización:</h2>
    
    <div class="company-info">
      <img class="company-icon" src="./icons/zurich.png">
      <p>Zurich: $${calcularCotizacion(edad, sa, coeficientesCompania.A).toLocaleString()}</p>
    </div>
    
    <div class="company-info">
      <img class="company-icon" src="./icons/allianz.png">
      <p>Allianz: $${calcularCotizacion(edad, sa, coeficientesCompania.B).toLocaleString()}</p>
    </div>
    
    <div class="company-info">
      <img class="company-icon" src="./icons/sancor.png">
      <p>Sancor: $${calcularCotizacion(edad, sa, coeficientesCompania.C).toLocaleString()}</p>
    </div>
  </article>
  `;
  return divCotizacion;
}

function updateCotizacionesHistoricas(cotizacionesHistoricas, cotizacionActual) {
  cotizacionesHistoricas.push(cotizacionActual);
  sessionStorage.setItem("cotizacionesHistoricas", JSON.stringify(cotizacionesHistoricas));
}

function displayCotizacionesHistoricas(cotizacionesHistoricas) {
  const divCotizacionesHistoricas = document.createElement("div");
  divCotizacionesHistoricas.classList.add("cotizaciones-historicas");
  divCotizacionesHistoricas.innerHTML = "<h2>Tus cotizaciones anteriores</h2>";
  cotizacionesHistoricas
    .slice(0, -1)
    .map((cotizacion, index) => {
      return createCotizacionElement(
        cotizacion,
        cotizacion.nombreCompleto,
        cotizacion.edad,
        cotizacion.cp,
        cotizacion.marca,
        cotizacion.modelo,
        cotizacion.version,
        cotizacion.ano,
        cotizacion.sumaAsegurada
      );
    })
    .forEach((element) => {
      divCotizacionesHistoricas.appendChild(element);
    });

  if (divCotizacionesHistoricasPrevio) {
    divCotizacionesHistoricasPrevio.remove();
  }

  document.body.appendChild(divCotizacionesHistoricas);
  divCotizacionesHistoricasPrevio = divCotizacionesHistoricas;
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (divPrevio) {
    divPrevio.remove();
  }

  if (divCotizacionesHistoricasPrevio) {
    divCotizacionesHistoricasPrevio.remove();
  }

  const { nombre, apellido, edad, cp, marca, modelo, version, ano } = formulario.elements;
  const nombreCompleto = `${nombre.value} ${apellido.value}`;

  const sa = await consultarSA(marca.value, modelo.value, version.value, parseInt(ano.value));
  const cotizacionesHistoricas = obtenerCotizacionesHistoricas();

  const cotizacionActual = {
    nombreCompleto,
    edad: parseInt(edad.value),
    cp: cp.value,
    marca: marca.value,
    modelo: modelo.value,
    version: version.value,
    ano: parseInt(ano.value),
    sumaAsegurada: parseInt(sa)
  };

  const divCotizacionActual = createCotizacionElement(
    cotizacionActual,
    nombreCompleto,
    cotizacionActual.edad,
    cotizacionActual.cp,
    cotizacionActual.marca,
    cotizacionActual.modelo,
    cotizacionActual.version,
    cotizacionActual.ano,
    cotizacionActual.sumaAsegurada
  );
  document.body.appendChild(divCotizacionActual);
  divPrevio = divCotizacionActual;

  updateCotizacionesHistoricas(cotizacionesHistoricas, cotizacionActual);
  displayCotizacionesHistoricas(cotizacionesHistoricas);

  // Mostrar alerta de Sweet Alert
  swal("Cotización exitosa", "La cotización se mostrará debajo.", "success");
});