function consultarSA(marca, modelo, version, ano){
  const fs = require('fs');
  const xlsx = require('xlsx');
  const workbook = xlsx.readFile('.\\Tabla de valores.xlsx');
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  const vehiculos = [];
  
  const columnNames = Object.keys(data[0]);
  
  for (let i = 0; i < data.length; i++) {
    const object = {};
    for (let j = 0; j < columnNames.length; j++) {
      object[columnNames[j]] = data[i][columnNames[j]];
    }
    vehiculos.push(object);
  }

  const vehiculosPorMarca = vehiculos.filter((el) => el.MARCA === marca);
  const vehiculosPorModelo = vehiculosPorMarca.filter((el) => el.MODELO === modelo);
  const vehiculosPorVersion = vehiculosPorModelo.filter((el) => el.VERSION === version);
  const vehiculosPorAno = vehiculosPorVersion.filter((el) => el.ANO === ano);

  let sumaAsegurada = vehiculosPorAno[0].SA

  return sumaAsegurada
}

console.log(`La suma asegurada es ${consultarSA("AGRALE", "AGRALE", "10000  S", 2016)}`)

// let marca = prompt("Ingrese la marca:")
// let modelo = prompt("Ingrese el modelo: ")
// let version = prompt("Ingrese la versión: ")
// let ano = parseInt(prompt("Ingrese el año: "))

// let sa = consultarSA(marca, modelo, version, ano)

// alert(`La suma asegurada es ${sa}`)

