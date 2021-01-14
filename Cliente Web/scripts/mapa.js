const filtro = document.querySelector("#filtrogas");
filtro.addEventListener("change", async () => {
    console.log(filtro.value);
    await ponerGradiente(filtro.value)
})
const noLecturas = document.querySelector(".no-medidas");
const sidebar = document.querySelector(".sidebar");
const iconoFiltros = document.querySelector(".menu");
/*iconoFiltros.addEventListener("click", () => {
    //alert();
    toggleSidebar();
})

function toggleSidebar() {
    sidebar.classList.toggle("hidden-sidebar");
}*/




var mapa;
var gradiente;

async function initMap() {

    mapa = new google.maps.Map(document.getElementById('mapa'), {
        center: {
            lat: 39.0,
            lng: -0.2
        },
        zoom: 14,
    });

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(38.951998, -0.191404)
    });

    marker.setMap(mapa);
    
    marker.addListener("click", await valorEstacion);

    await ponerGradiente("CO2")
}

async function valorEstacion(){
    
    var mediciones = await laLogica.get("medicionesOficiales")
    
    console.log(mediciones)
}

async function ponerGradiente(tipoMedicion) {

    vaciarGradiente()

    var mediciones = await laLogica.get("lecturas/" + tipoMedicion)

    gradiente = new google.maps.visualization.HeatmapLayer({
        data: obtenerDatos(mediciones),
        radius: 0.001,
        dissipating: false,
    });

    gradiente.setMap(mapa);

}

function obtenerDatos(mediciones) {

    var datosGradiente = []
    var mayor= mediciones[0];

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
