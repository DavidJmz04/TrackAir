// -------------------------------------
// ------ Autor: Ignasi Marí Giner & Marc Oller Caballé
// ------ 21-10-2020
// -------------------------------------

//Cuando se carga la página
window.onload = function () {
    main();
};
let laLogica;
let intervalo;
let testMode = false;

// Punto de arranque
function main() {
    //Creamos objeto de la Logica
    laLogica = new Logica();
    console.log(document.cookie)
    if(document.cookie != ""){
    document.getElementById("nombreText").innerHTML = document.cookie.split(';')[0].split('=')[1]
        cargarUsuario(document.cookie.split(';')[1].split('=')[1])
        document.getElementById("usuarioBox").style.display = "block";
    }
    //mostrarMediciones();
    mostrarMedicionesTiempoReal();

    mostrarMediciones();
    //Cada 4 segundos recuperamos los datos
    /*
        intervalo = setInterval(() => {
            mostrarMediciones();
        }, 4000);
    
        //Cada 6 segundos hace post con mediciones fake
        setInterval(() => {
            testPOST();
        }, 6000);
    */
    //Botón para activar y desactivar
    var btn = document.getElementById("btn-test");
    btn.onclick = () => {
        testMode = !testMode;
    };
}
// ()

function cargarUsuario(id){
    let calidadText = document.getElementById("calidadAire");
    let promesa = laLogica.recuperarCalidadAire(id).then((calidad) => {
        calidadText.innerHTML = calidad ? calidad.calidadMedia : "No hay información"
    })
}

// mostrarMedicionesTiempoReal()
function mostrarMedicionesTiempoReal() {
    var medicionesContent = document.getElementById("medicionesTiempoReal-content");
    //console.log("mostrarMediciones()");
    let promesa = laLogica.insertarMedicionesPlaceholder().then((mediciones) => {
        if (mediciones) {
            medicionesContent.innerHTML = "";
            mediciones.lecturas.forEach((medicion) => {
                //console.log(medicion);
                let row = document.createElement("div");
                row.classList.add("row");

                let divHora = document.createElement("div")
                divHora.innerText = mediciones.fecha + " " + medicion.hora + ":00"
                divHora.classList.add("cell");
                let divValor = document.createElement("div");
                divValor.innerText = medicion['contaminación'];
                divValor.classList.add("cell");

                let divCalidad = document.createElement("div");
                divCalidad.innerText = medicion.calidad;
                divCalidad.classList.add("cell");

                row.append(divHora);
                row.append(divValor);
                row.append(divCalidad);
                let color
                switch (medicion.calidad) {
                    case "Peligroso":
                        color = "#ff8c8c"
                        break;
                    case "Mala":
                        color = "#fab8b8"
                        break;
                    case "Media":
                        color = "#f4fab8"
                        break;
                    case "Buena":
                        color = "#B8FAF0"
                        break;
                    case "Muy buena":
                        color = "#bcfab8"
                        break;
                }
                row.style.backgroundColor = color
                medicionesContent.appendChild(row);
            })
        }
    })
    promesa = laLogica.recuperarMedicionesTiempoReal().then((mediciones) => {
        if (mediciones) {
            medicionesContent.innerHTML = "";
            let i = 0
            mediciones['mediciones'].forEach((medicion) => {
                //console.log(medicion);
                let row = document.createElement("div");
                row.classList.add("row");

                let divHora = document.createElement("div");
                divHora.innerText = mediciones.fecha + " " + (i++) + ":00";
                divHora.classList.add("cell");
                let divValor = document.createElement("div");
                divValor.innerText = medicion['contaminación'];
                divValor.classList.add("cell");

                let divCalidad = document.createElement("div");
                divCalidad.innerText = medicion.calidad;
                divCalidad.classList.add("cell");

                row.append(divHora);
                row.append(divValor);
                row.append(divCalidad);
                let color
                switch (medicion.calidad) {
                    case "Peligroso":
                        color = "#ff8c8c"
                        break;
                    case "Mala":
                        color = "#fab8b8"
                        break;
                    case "Media":
                        color = "#f4fab8"
                        break;
                    case "Buena":
                        color = "#B8FAF0"
                        break;
                    case "Muy buena":
                        color = "#bcfab8"
                        break;
                }
                row.style.backgroundColor = color
                medicionesContent.appendChild(row);
            });
        } else {
        }
    });
}

// mostrarMediciones() llama a la logica.recuperarMediciones y las inserta en el html
function mostrarMediciones() {
    var medicionesContent = document.getElementById("mediciones-content");
    console.log(medicionesContent);

    //console.log("mostrarMediciones()");
    let promesa = laLogica.recuperarMediciones().then((mediciones) => {
        if (mediciones) {
            medicionesContent.innerHTML = "";
            mediciones['mediciones'].forEach((medicion) => {
                //console.log(medicion);
                let row = document.createElement("div");
                row.classList.add("row");


                let divHora = document.createElement("div");
                divHora.innerText =dateToString(medicion.momento);
                divHora.classList.add("cell");

                let divValor = document.createElement("div");
                divValor.innerText = medicion.valor;
                divValor.classList.add("cell");
                /*
                                let divUbicacion = document.createElement("div");
                                divUbicacion.innerText =medicion.ubicacion;
                                divUbicacion.classList.add("cell");
                */
                let divCalidad = document.createElement("div");
                divCalidad.innerText = medicion.calidad;
                divCalidad.classList.add("cell");

                let divTipo = document.createElement("div");
                divTipo.innerText = medicion.tipoMedicion;
                divTipo.classList.add("cell");

                row.append(divHora);
                row.append(divValor);
                row.append(divCalidad);
                let color
                switch (medicion.calidad) {
                    case "Peligroso":
                        color = "#ff8c8c"
                        break;
                    case "Mala":
                        color = "#fab8b8"
                        break;
                    case "Media":
                        color = "#f4fab8"
                        break;
                    case "Buena":
                        color = "#B8FAF0"
                        break;
                    case "Muy buena":
                        color = "#bcfab8"
                        break;
                }
                row.style.backgroundColor = color
                medicionesContent.appendChild(row);
            });
        } else {
        }
    });
}

function dateToString(date){
    var date = new Date(date),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return  [day, mnth, date.getFullYear()].join("/") + " " + date.getHours() + ":" + date.getMinutes();
}

//llama a la logica y hace postea mediciones fake
function testPOST() {
    if (testMode) {
        let promesa = laLogica.testPOST().then((res) => {
            console.log(res);
        });
    }
}

// Grafico ejemplo
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['20 nov', '21 nov', '22 nov', '23 nov', '24 nov', '25 nov'],
        datasets: [{
            label: 'NO2',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 3
        }]
    },
    options: {
        scales: {

            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }

    }
});
//show hide divs
function showHideFunction() {
    var x = document.getElementById("mediciones-container");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}