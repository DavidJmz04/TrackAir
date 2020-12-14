const calidadAireMult = {
    NO2: 50,
    SO2: 50,
    CO2: 50,
    O3: 60
}

const calidadAire = {
  0: "Muy buena",
  1: "Buena",
  2: "Media",
  3: "Mala",
  4: "Peligroso"
}

module.exports = class Utilidades {

  // .................................................................
  // JSON(mediciones oficiales) -> convertirAJSONpropio() --> JSON
  // .................................................................
  convertirAJSONpropio(csv) {
    var text = '{"fecha":"' + this.fechaActual() + '", "lecturas":[';
    var calidad, total;
    csv.forEach(element => {
      total = element['SO2 (µg/m³)'] + element['NO2 (µg/m³)'] + element['O3 (µg/m³)'];
      calidad = this.procesarCalidadAire(element, total)
      text += '{"contaminación":' + total + ',"hora":' + element['Hora Solar'] + ',"calidad":"' + calidadAire[calidad] + '",'
        + '"contaminantes":{"SO2 (µg/m³)":' + element['SO2 (µg/m³)'] + ',"NO2 (µg/m³)":' + element['NO2 (µg/m³)'] + ',"O3 (µg/m³)":' + element['O3 (µg/m³)'] + '}}';
      if (element['Hora Solar'] != '23') text += ','
      else text += ']}'
    });
    return JSON.parse(text)
  }

  // .................................................................
  // JSON(mediciones oficiales en tiempo real) -> convertirTiempoRealAJSONpropio() --> JSON
  // .................................................................
  convertirTiempoRealAJSONpropio(csv) {
    var text;
    var calidad, total, i = 0;
    var horaAnterior = 0
    var sumas = []
    sumas.push(0)
    var total = 0
    var lecturas = ""
    csv.forEach(element => {
      var abreviatura = element.abreviatura;
      if (horaAnterior != element.hora && horaAnterior != 0) {
        i++
        sumas.push(0)
      }
      if (element.abreviatura == "SO2" || element.abreviatura == "NO2" || element.abreviatura == "O3") {
        var temporal = element.valor;
        horaAnterior = element.hora
        sumas[i] += temporal
      }
      //lecturas += "{'"+ abreviatura+"':"+ element.valor +"}"
    });
    i= 0
    sumas.forEach(suma =>{
      lecturas += '{"contaminación":' + suma + ',"calidad":"'+ calidadAire[this.procesarCalidadAire({"tipoMedicion":"O3"},suma)] +'"}'
      total += suma
      if(i!=sumas.length-1) lecturas += ","
      i++
    })
    total = total/sumas.length
    text = '{"fecha":"' + this.fechaActual() + '", "calidadMedia":"'+ calidadAire[this.procesarCalidadAire({"tipoMedicion":"O3"},total)] +'", "mediciones":[' + lecturas + "]}"
    return JSON.parse(text)
  }

  // .................................................................
  // String -> convertirAJSONpropio() --> JSON
  // .................................................................
  procesarCalidadAireAJSON(json) {
    var text = '{"mediciones":['
    var i = 0, media = 0;
    var calidadNum
    json.forEach(element => {
      calidadNum = this.procesarCalidadAire(element, element['valor'])
      media += calidadNum;
      //Construcción del JSON
      text += '{"valor":' + element['valor'] + ',"momento":"' + element['momento']
        + '","ubicacion":"' + element['ubicacion'] + '","tipoMedicion":"' + element['tipoMedicion']
        + '","calidad":"' + calidadAire[calidadNum] + '"}' + (i++ < json.length - 1 ? ',' : '],"calidadMedia":"' + calidadAire[Math.round(media / json.length)] + '"}')
    })
    console.log(text + " - " + media + " : " + json.length)
    return JSON.parse(text);
  }

  procesarCalidadAire(element, valor) {
    //Sacamos el indice de contaminación partiendo la medida por el denominador de contaminación
    var calidadNum = Math.floor(valor / calidadAireMult[element['tipoMedicion']])
    //Si es Ozono, la calidad del aire va escalada uniformemente, en cambio tiene crecimiento exponencial.
    if (element['tipoMedicion'] == "O3") {
      calidadNum = (calidadNum > 4 ? 4 : calidadNum)
    } else {
      if (calidadNum >= 8) calidadNum = 4
      else if (calidadNum >= 4 && calidadNum < 8) calidadNum = 3
      else if (calidadNum >= 2 && calidadNum < 4) calidadNum = 2
    }
    return calidadNum;
  }


  fechaActual() {
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
