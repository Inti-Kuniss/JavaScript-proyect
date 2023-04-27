// Función para calcular el costo del seguro de automóvil
function calcularSeguroAuto(modelo, edad, lugar) {
  let costo = 0;
  
  // Tarifas para diferentes modelos de automóvil
  switch (modelo) {
  case "corsa":
  costo = 500;
  break;
  case "fiesta":
  costo = 700;
  break;
  case "focus":
  costo = 1000;
  break;
  default:
  costo = 400;
  }
  
  // Tarifas adicionales para diferentes edades de conductor
  if (edad < 25) {
  costo += 200;
  } else if (edad >= 25 && edad < 35) {
  costo += 150;
  }
  
  // Tarifas adicionales para diferentes lugares de residencia
  switch (lugar) {
  case "urbana":
  costo += 200;
  break;
  case "rural":
  costo -= 100;
  break;
  default:
  break;
  }
  
  // Devolver el costo total del seguro
  return costo;
  }
  
  // Variables para almacenar la información del usuario
  let modelo;
  let edad;
  let lugar;
  let costoSeguro;
  
  // Solicitar y validar el modelo del automóvil
  do {
  modelo = prompt("Ingresa el modelo de tu automóvil (corsa, fiesta, focus):");
  if (!["corsa", "fiesta", "focus"].includes(modelo)) {
  alert("El modelo no se encuentra en el sistema (probá con corsa, fiesta, focus).");
  }
  } while (!["corsa", "fiesta", "focus"].includes(modelo));
  
  // Solicitar y validar la edad del conductor
  do {
  edad = parseInt(prompt("Ingresa tu edad:"));
  if (isNaN(edad) || edad < 18) {
  alert("Por favor, ingresa una edad válida (mayor o igual a 18 años).");
  }
  } while (isNaN(edad) || edad < 18);
  
  // Solicitar y validar el lugar de residencia
  do {
  lugar = prompt("Ingresa tu zona (urbana, rural):");
  if (!["urbana", "rural"].includes(lugar)) {
  alert("Por favor, ingresa un lugar válido (urbana, rural).");
  }
  } while (!["urbana", "rural"].includes(lugar));
  
  // Calcular el costo del seguro de automóvil usando la función
  costoSeguro = calcularSeguroAuto(modelo, edad, lugar);
  
  // Mostrar el resultado al usuario
  alert(`El costo de tu seguro de automóvil es de $${costoSeguro}`);