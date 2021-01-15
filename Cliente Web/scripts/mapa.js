var mapa;
var gradiente

async function initMap() {

    mapa = new google.maps.Map(document.getElementById('mapa'), {
        center: {
            lat: 39.0,
            lng: -0.2
        },
        zoom: 14,
    });

    var infowindow = new google.maps.InfoWindow({
        content: await crearContenido()
    });

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(38.965289, -0.182671),
        title: "Drag me!",
        map: mapa
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

async function crearContenido() {

    var contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
        '<div id="bodyContent">' +
        "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
        "sandstone rock formation in the southern part of the " +
        "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
        "south west of the nearest large town, Alice Springs; 450&#160;km " +
        "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
        "features of the Uluru - Kata Tjuta National Park. Uluru is " +
        "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
        "Aboriginal people of the area. It has many springs, waterholes, " +
        "rock caves and ancient paintings. Uluru is listed as a World " +
        "Heritage Site.</p>" +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
        "(last visited June 22, 2009).</p>" +
        "</div>" +
        "</div>";
    return contentString
}

async function ponerGradiente(tipoMedicion) {

    vaciarGradiente()

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
