let selectDia = document.querySelector('#selectDia')
let selectHora = document.querySelector('#selectHora')
let diasyhoras;
selectDia.addEventListener("change", dibujarOptionsHoras);

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


    await ponerGradienteInit("CO2")
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
    // console.log("Dia: "+selectDia.value)
    // console.log("Hora: "+selectHora.value)
    var noLecturas = document.getElementById("no-medidas");
    let dia = selectDia.value;
    let hora = selectHora.value
    // Hoy y ahora => recoger datos como hacíamos
    
    var mediciones = await laLogica.get("historico/" + dia+"-"+hora + "/" + tipoMedicion)
    
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

async function rellenarOpcionesSelectsDiasYHoras(){
    diasyhoras = await laLogica.get("historico");
    if(diasyhoras){
        crearOptionsDias(diasyhoras);
    }else{
        selectHora.style.enabled=false;
        selectDia.style.enabled=false;
    }
}
async function ponerGradienteInit(tipoMedicion) {

    vaciarGradiente()

    var mediciones = await laLogica.get("lecturas/" + tipoMedicion)
    console.log(mediciones);


    gradiente = new google.maps.visualization.HeatmapLayer({
        data: obtenerData(mediciones),
        radius: 0.001,
        dissipating: false,
    });

    gradiente.setMap(mapa);
    
}
function crearOptionsDias(diasyhoras){
    //console.log(diasyhoras)
    //selectDia
    let arrayOptions = []
    removeAllOptions(selectDia);
    for (var [key, value] of Object.entries(diasyhoras)) {
        let anyo = key.substring(0, 4);
        let mes = key.substring(4,6);
        let dia = key.substring(6,8);
        //console.log( dia+"/"+mes+"/"+anyo)
        arrayOptions.push(new Option(dia+"/"+mes+"/"+anyo, key));
        //selectDia.options[selectDia.options.length] = ;
        //console.log(selectDia.value)
    }
    arrayOptions.reverse();
    arrayOptions.forEach(x=>{
        selectDia.appendChild(x);
    })

    dibujarOptionsHoras();
}

function dibujarOptionsHoras(){
    console.log("PERROO")
    let arrayOptions = [];
    removeAllOptions(selectHora)
    for (var [key, value] of Object.entries(diasyhoras)) {
        if(key === selectDia.value){
            value.forEach(x=>{
                console.log(x)
                arrayOptions.push(new Option(x+":00h", x));
            })
        }
        
        arrayOptions.reverse();
        arrayOptions.forEach(x=>{
            selectHora.appendChild(x);
        })
    }
}

function removeAllOptions(selectBox) {
    while (selectBox.options.length > 0) {
        selectBox.remove(0);
    }
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
    console.log("rSeleccionado")
    laLogica.setTipoGasSeleccionado(valor)
    await ponerGradiente(valor)
}

async function diaSeleccionado() {
    console.log("Dia seleccionado")
    console.log(selectHora.value)
    setTimeout(async ()=>{await ponerGradiente(laLogica.getTipoGasSeleccionado())}, 500)
    
}
