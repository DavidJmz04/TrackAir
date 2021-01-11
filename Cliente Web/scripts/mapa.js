const filtro = document.querySelector("#filtrogas");
filtro.addEventListener("change", async () => {
    console.log(filtro.value);
    await ponerGradiente(filtro.value)
})
const noLecturas = document.querySelector(".no-medidas");
const sidebar = document.querySelector(".sidebar");
const iconoFiltros = document.querySelector(".menu");
iconoFiltros.addEventListener("click", () => {
    //alert();
    toggleSidebar();
})

function toggleSidebar() {
    sidebar.classList.toggle("hidden-sidebar");
}

var mapa;
var tSizeBueno = 0;
var tSizeMedio = 0;
var tSizeMalo = 0;

var gradienteBueno;
var gradienteMedio;
var gradienteMalo;

const verde = [
    'rgba(0, 255, 0, 0.1)',
    'rgba(0, 255, 0, 0.2)',
    'rgba(0, 255, 0, 0.3)',
    'rgba(0, 255, 0, 0.4)',
    'rgba(0, 255, 0, 0.5)',
    'rgba(0, 255, 0, 0.6)',
    'rgba(0, 255, 0, 0.7)',
    'rgba(0, 255, 0, 0.8)',
    'rgba(0, 255, 0, 0.9)',
    'rgba(0, 255, 0, 1)']

const amarillo = ['rgba(255, 255, 0, 0)',
    'rgba(255, 255, 0, 0.1)',
    'rgba(255, 255, 0, 0.2)',
    'rgba(255, 255, 0, 0.3)',
    'rgba(255, 255, 0, 0.4)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(255, 255, 0, 0.6)',
    'rgba(255, 255, 0, 0.7)',
    'rgba(255, 255, 0, 0.8)',
    'rgba(255, 255, 0, 0.9)',
    'rgba(255, 255, 0, 1)']

const rojo = [
    'rgba(255, 0, 0, 0)',
    'rgba(255, 0, 0, 0.1)',
    'rgba(255, 0, 0, 0.2)',
    'rgba(255, 0, 0, 0.3)',
    'rgba(255, 0, 0, 0.4)',
    'rgba(255, 0, 0, 0.5)',
    'rgba(255, 0, 0, 0.6)',
    'rgba(255, 0, 0, 0.7)',
    'rgba(255, 0, 0, 0.8)',
    'rgba(255, 0, 0, 0.9)',
    'rgba(255, 0, 0, 1)']

async function initMap() {

    mapa = new google.maps.Map(document.getElementById('mapa'), {
        center: {
            lat: 39.0,
            lng: -0.2
        },
        zoom: 14,
    });

    await ponerGradiente("CO2")
}

async function ponerGradiente(tipoMedicion) {

    vaciarGradientes()

    var mediciones = await laLogica.get("lecturas/" + tipoMedicion)

    if (mediciones.length > 0) noLecturas.style.display = "none";
    else noLecturas.style.display = "block";
    
    let _medicionesBuenas = medicionesBuenas(mediciones);
    tSizeBueno = _medicionesBuenas.length
    gradienteBueno = crearGradiente(_medicionesBuenas, verde)
    modificarZoom(gradienteBueno, tSizeBueno)

    let _medicionesMedias = medicionesMedias(mediciones);
    tSizeMedio = _medicionesMedias.length
    gradienteMedio = crearGradiente(_medicionesMedias, amarillo, tSizeMedio)
    modificarZoom(gradienteMedio, tSizeMedio)

    let _medicionesMalas = medicionesMalas(mediciones);
    tSizeMalo = _medicionesMalas.length
    gradienteMalo = crearGradiente(_medicionesMalas, rojo, tSizeMalo)
    modificarZoom(gradienteMalo, tSizeMalo)
}

function medicionesBuenas(mediciones) {

    var datosGradiente = []

    for (var i = 0; i < mediciones.length; i++) {

        if (mediciones[i].value < 50) datosGradiente.push({
            location: new google.maps.LatLng(mediciones[i].lat, mediciones[i].lon),
            weight: mediciones[i].value
        })
    }

    return datosGradiente
}

function medicionesMedias(mediciones) {

    var datosGradiente = []

    for (var i = 0; i < mediciones.length; i++) {

        if (mediciones[i].value > 50 && mediciones[i].value < 100) datosGradiente.push({
            location: new google.maps.LatLng(mediciones[i].lat, mediciones[i].lon),
            weight: mediciones[i].value
        })
    }

    return datosGradiente
}

function medicionesMalas(mediciones) {

    var datosGradiente = []

    for (var i = 0; i < mediciones.length; i++) {

        if (mediciones[i].value > 100) datosGradiente.push({
            location: new google.maps.LatLng(mediciones[i].lat, mediciones[i].lon),
            weight: mediciones[i].value
        })
    }

    return datosGradiente
}

function crearGradiente(datosGradiente, color) {

    TILE_SIZE = datosGradiente.length

    gradiente = new google.maps.visualization.HeatmapLayer({
        data: datosGradiente,
        radius: getNewRadius()
    });

    gradiente.setMap(mapa);
    gradiente.set('gradient', color);

    return gradiente;
}

function modificarZoom(gradiente, tSize) {

    google.maps.event.addListener(mapa, 'zoom_changed', function () {

        TILE_SIZE = tSize

        var zoomLevel = mapa.getZoom();
        gradiente.setOptions({
            radius: getNewRadius()
        });
    });
}

function vaciarGradientes() {

    vaciarGradiente(gradienteBueno)
    vaciarGradiente(gradienteMedio)
    vaciarGradiente(gradienteMalo)
}

function vaciarGradiente(gradiente) {

    if (gradiente != null) {
        gradiente.setData([])
        gradiente.set('gradient', null)
    }

}






var TILE_SIZE; //Nº puntos interpolados

//Mercator --BEGIN--
function bound(value, opt_min, opt_max) {
    if (opt_min !== null) value = Math.max(value, opt_min);
    if (opt_max !== null) value = Math.min(value, opt_max);
    return value;
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

function MercatorProjection() {
    this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2,
        TILE_SIZE / 2);
    this.pixelsPerLonDegree_ = TILE_SIZE / 360;
    this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
}

MercatorProjection.prototype.fromLatLngToPoint = function (latLng, opt_point) {
    var me = this;
    var point = opt_point || new google.maps.Point(0, 0);
    var origin = me.pixelOrigin_;

    point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

    // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
    // 89.189.  This is about a third of a tile past the edge of the world
    // tile.
    var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
    point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
    return point;
};

MercatorProjection.prototype.fromPointToLatLng = function (point) {
    var me = this;
    var origin = me.pixelOrigin_;
    var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
    var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
    var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
    return new google.maps.LatLng(lat, lng);
};

//Mercator --END--

var desiredRadiusPerPointInMeters = 1000;

function getNewRadius() {

    var numTiles = 1 << mapa.getZoom();
    var center = mapa.getCenter();
    var moved = google.maps.geometry.spherical.computeOffset(center, 10000, 90); /*1000 meters to the right*/
    var projection = new MercatorProjection();
    var initCoord = projection.fromLatLngToPoint(center);
    var endCoord = projection.fromLatLngToPoint(moved);
    var initPoint = new google.maps.Point(
        initCoord.x * numTiles,
        initCoord.y * numTiles);
    var endPoint = new google.maps.Point(
        endCoord.x * numTiles,
        endCoord.y * numTiles);
    var pixelsPerMeter = (Math.abs(initPoint.x - endPoint.x)) / 10000.0;
    var totalPixelSize = Math.floor(desiredRadiusPerPointInMeters * pixelsPerMeter);
    return totalPixelSize;

}
