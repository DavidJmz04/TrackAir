var mapa;
var gradiente;
var datosGradiente= [];

function initMap() {
    mapa = new google.maps.Map(document.getElementById('mapa'), {
        center: {
            lat: 39.0,
            lng: -0.2
        },
        zoom: 13,
    });

    ponerGradiente("GI")
    gradiente = new google.maps.visualization.HeatmapLayer({
        data: datosGradiente,
    });
    gradiente.setMap(mapa);
}

async function ponerGradiente(tipoMedicion) {

    vaciarGradiente();
    
    /*var mediciones = await laLogica.obtenerLecturas(tipoMedicion)
    
    for (var i = 0; i < mediciones; i++) datosGradiente.push({location: new google.maps.LatLng(mediciones[i].lat, mediciones[i].lon), weight: mediciones[i].value})*/

    var datosGradiente = [
        {
            location: new google.maps.LatLng(39.0, -0.2),
            weight: 2
        },
        {
            location: new google.maps.LatLng(39.082, -0.2043),
            weight: 2
        },
        {
            location: new google.maps.LatLng(39.082, -0.2041),
            weight: 3
        },
        {
            location: new google.maps.LatLng(37.782, -122.439),
            weight: 2
        },
        {
            location: new google.maps.LatLng(37.782, -122.435),
            weight: 0.5
        },

        {
            location: new google.maps.LatLng(37.785, -122.447),
            weight: 3
        },
        {
            location: new google.maps.LatLng(37.785, -122.445),
            weight: 2
        },
        {
            location: new google.maps.LatLng(37.785, -122.441),
            weight: 0.5
        },
        {
            location: new google.maps.LatLng(37.785, -122.437),
            weight: 2
        },
        {
            location: new google.maps.LatLng(37.785, -122.435),
            weight: 3
        }
    ];
}

function vaciarGradiente() {

    datosGradiente= []
    gradiente.setData(datosGradiente)
}