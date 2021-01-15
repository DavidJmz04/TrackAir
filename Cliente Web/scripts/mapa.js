var mapa;
var gradiente
var infowindow

async function initMap() {

    mapa = new google.maps.Map(document.getElementById('mapa'), {
        center: {
            lat: 39.0,
            lng: -0.2
        },
        zoom: 14,
    });

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(38.965289, -0.182671),
        title: "Drag me!",
        map: mapa
    });
    
    infowindow = new google.maps.InfoWindow({
        //content: await crearContenido("CO2")
    });
    
    var abierto= false

    marker.addListener("click", () => {

        if (!abierto) {
            abierto= true
            infowindow.open(mapa, marker);
            
        } else {
            infowindow.close()
            abierto= false
        }
    });

    await ponerGradiente("CO2")
}

async function crearContenido(tipo) {

    var res = await laLogica.get("medicionesOficialesUltima/" + tipo);
    
    var contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h6 id="firstHeading" class="firstHeading">Estacion de medida oficial de Gandía</h6>' +
        '<div id="bodyContent">' +
        "<p><b>Contaminacion a las " + res[1] + ":</b> " + res[0] + " </p>" +
        "</div>" +
        "</div>";
    return contentString
}

async function ponerGradiente(tipoMedicion) {

    vaciarGradiente()
    infowindow = new google.maps.InfoWindow({
        content: await crearContenido(tipoMedicion)
    });

    var noLecturas = document.getElementById("no-medidas");

    var mediciones = await laLogica.get("lecturas/" + tipoMedicion)

    if (mediciones.length > 0) {
        gradiente = new google.maps.visualization.HeatmapLayer({
            data: obtenerData(mediciones),
            radius: 0.001,
            dissipating: false,
        });

        gradiente.setMap(mapa);
        noLecturas.style.display = "none";
    } else noLecturas.style.display = "block";
}

function obtenerData(mediciones) {

    var datosGradiente = []
    var mayor = mediciones[0];

    for (var i = 0; i < mediciones.length; i++) {
        if (mediciones[i].value > mayor.value) mayor = mediciones[i];
        if (mediciones[i].value > 5) datosGradiente.push({
            location: new google.maps.LatLng(mediciones[i].lat, mediciones[i].lon),
            weight: mediciones[i].value
        })
    }
    datosGradiente.push({
        location: new google.maps.LatLng(mayor.lat, mayor.lon),
        weight: 95
    })
    return datosGradiente
}

function vaciarGradiente() {

    if (gradiente != null) gradiente.setData([])

}

async function rSeleccionado(valor) {

    await ponerGradiente(valor)
}
