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
  // String -> convertirAJSONpropio() --> JSON
  // .................................................................
  convertirAJSONpropio(csv){
    var text="["
    csv.forEach(element => {
      var total = element['SO2 (µg/m³)'] + element['NO2 (µg/m³)'] + element['O3 (µg/m³)'];
      text=text + '{"Hora":' + element['Hora Solar'] + ',"Contaminación":' + total + ',"Calidad":"' +element['Qualitat Aire'] + '"}';
      if(element['Hora Solar'] != '23') text+=','
      else text+=']'
    });
    
    return JSON.parse(text)
  }
  
  // .................................................................
  // String -> convertirAJSONpropio() --> JSON
  // .................................................................
  procesarCalidadAireAJSON(json){
    var text="["
    var i = 0
    var calidad, calidadNum
    json.forEach(element => {
        //Sacamos el indice de contaminación partiendo la medida por el denominador de contaminación
        calidadNum = Math.floor(element['valor']/calidadAireMult[element['tipoMedicion']])
        //Si es Ozono, la calidad del aire va escalada uniformemente, en cambio tiene crecimiento exponencial.
        if (element['tipoMedicion']=="O3"){
            calidadNum = (calidadNum>4?4:calidadNum)
        }else{
            if(calidadNum >= 8) calidadNum = 4
            else if(calidadNum >= 4 && calidadNum < 8) calidadNum = 3
            else if(calidadNum >=2 && calidadNum < 4) calidadNum = 2
        }
        calidad = calidadAire[calidadNum]
        //Construcción del JSON
        text +='{"valor":' + element['valor'] + ',"momento":"' + element['momento'] 
            + '","ubicacion":"' + element['ubicacion'] + '","tipoMedicion":"' + element['tipoMedicion'] 
            + '","calidad":"' + calidad + '"}' + (i++<json.length-1 ? ',' : ']' )
    })
    
    return JSON.parse(text);
  }
}