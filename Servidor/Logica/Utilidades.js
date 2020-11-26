const calidadAireMult = {
  NO2: 50,
  SO2: 50,
  CO2: 50,
  O3: 60
}

const calidadAire ={
  0:"Muy buena",
  1:"Buena",
  2:"Media",
  3:"Mala",
  4:"Peligroso"
}

module.exports = class Utilidades {

// .................................................................
// JSON(mediciones oficiales) -> convertirAJSONpropio() --> JSON
// .................................................................
convertirAJSONpropio(csv){
  var text='["Fecha":"'+ this.fechaActual() + '", "Lecturas":';
  var calidad, total;
  csv.forEach(element => {
    total = element['SO2 (µg/m³)'] + element['NO2 (µg/m³)'] + element['O3 (µg/m³)'];
    calidad = this.procesarCalidadAire(element, total)
    text += '{"Contaminación (ug/m3)":' + total + ',"Hora":' + element['Hora Solar'] + ',"Calidad":"' + calidad + '",' 
    + '"Contaminantes":{"SO2 (µg/m³)":' + element['SO2 (µg/m³)'] + ',"NO2 (µg/m³)":' + element['NO2 (µg/m³)'] + ',"O3 (µg/m³)":' + element['O3 (µg/m³)'] + '}}';
    if(element['Hora Solar'] != '23') text+=','
    else text+='}]'
  });
  return JSON.parse(text)
}

// .................................................................
// String -> convertirAJSONpropio() --> JSON
// .................................................................
procesarCalidadAireAJSON(json){
  var text="["
  var i = 0
  var calidad
  json.forEach(element => {
      calidad = this.procesarCalidadAire(element)
      //Construcción del JSON
      text +='{"valor":' + element['valor'] + ',"momento":"' + element['momento'] 
          + '","ubicacion":"' + element['ubicacion'] + '","tipoMedicion":"' + element['tipoMedicion'] 
          + '","calidad":"' + calidad + '"}' + (i++<json.length-1 ? ',' : ']' )
  })
  
  return JSON.parse(text);
}

procesarCalidadAire(element){
      //Sacamos el indice de contaminación partiendo la medida por el denominador de contaminación
      var calidadNum = Math.floor(element['valor']/calidadAireMult[element['tipoMedicion']])
      //Si es Ozono, la calidad del aire va escalada uniformemente, en cambio tiene crecimiento exponencial.
      if (element['tipoMedicion']=="O3"){
          calidadNum = (calidadNum>4?4:calidadNum)
      }else{
          if(calidadNum >= 8) calidadNum = 4
          else if(calidadNum >= 4 && calidadNum < 8) calidadNum = 3
          else if(calidadNum >=2 && calidadNum < 4) calidadNum = 2
      }
  return calidadAire[calidadNum];
}

procesarCalidadAire(element, valor){
  //Sacamos el indice de contaminación partiendo la medida por el denominador de contaminación
  var calidadNum = Math.floor(valor/calidadAireMult[element['tipoMedicion']])
  //Si es Ozono, la calidad del aire va escalada uniformemente, en cambio tiene crecimiento exponencial.
  if (element['tipoMedicion']=="O3"){
      calidadNum = (calidadNum>4?4:calidadNum)
  }else{
      if(calidadNum >= 8) calidadNum = 4
      else if(calidadNum >= 4 && calidadNum < 8) calidadNum = 3
      else if(calidadNum >=2 && calidadNum < 4) calidadNum = 2
  }
return calidadAire[calidadNum];
}


fechaActual(){
  var fecha = new Date();
  var dd = String(fecha.getDate()).padStart(2, '0');
  var mm = String(fecha.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = fecha.getFullYear();

  fecha = dd + '/' + mm + '/' + yyyy;
  return fecha;
}

// ................................................................................................................................................
// <R>, <R>, <R>, <R>
// -->
// obtenerDistancia() <--
// <--
// <R>
// ................................................................................................................................................
//Empleamos la formula Haversvine
obtenerDistancia(lat1, lon1, lat2, lon2) {

  var R = 6371000

  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

}