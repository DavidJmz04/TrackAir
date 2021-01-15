let laLogica;
let testMode = false;

//Cuando se carga la página
window.onload = function () {
    main();
};

// Punto de arranque
function main() {

    //Creamos objeto de la Logica
    laLogica = new Logica();

    //Creamos la gráfica
    crearGrafica("Mediciones")

    console.log(document.cookie)
    if (document.cookie != "") {
        document.getElementById("nombreText").innerHTML = getCookie("name")
        cargarUsuario(getCookie("id"))
        document.getElementById("usuarioBox").style.display = "block";
    }




    mostrarMedicionesTiempoReal();

    mostrarMediciones();


    
}
// ()


function crearGrafica(titulo) {

    // create data
    var data = [
      ["January", 10000],
      ["February", 12000],
      ["March", 18000],
      ["April", 11000],
      ["May", 9000]
    ];

    // create a chart
    var chart = anychart.line();

    // create a line series and set the data
    var series = chart.line(data);
    
    // set the chart title
    chart.title(titulo);

    // set the titles of the axes
    var xAxis = chart.xAxis();
    xAxis.title("Hora");
    var yAxis = chart.yAxis();
    yAxis.title("Valor");

    // set the container id
    chart.container("myChart");
    
    chart.xScale().mode('continuous');

    // initiate drawing the chart
    chart.draw();

}




// texto -> getCookie() -> texto
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function cargarUsuario(id) {
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
        } else {}
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
                divHora.innerText = dateToString(medicion.momento);
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
        } else {}
    });
}

function dateToString(date) {
    var date = new Date(date),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("/") + " " + date.getHours() + ":" + date.getMinutes();
}

//llama a la logica y hace postea mediciones fake
function testPOST() {
    if (testMode) {
        let promesa = laLogica.testPOST().then((res) => {
            console.log(res);
        });
    }
}


//show hide divs
function showHideFunction() {
    var x = document.getElementById("mediciones-container");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
