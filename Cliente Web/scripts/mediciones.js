// -------------------------------------
// ------ Autor: Ignasi Marí Giner
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
    //mostrarMediciones();

    //Cada 4 segundos recuperamos los datos

    intervalo = setInterval(() => {
        mostrarMediciones();
    }, 4000);

    //Cada 6 segundos hace post con mediciones fake
    setInterval(() => {
        testPOST();
    }, 6000);

    //Botón para activar y desactivar
    var btn = document.getElementById("btn-test");
    btn.onclick = () => {
        testMode = !testMode;
    };
}
// ()

// mostrarMediciones() llama a la logica.recuperarMediciones y las inserta en el html
function mostrarMediciones() {
    var medicionesContent = document.getElementById("mediciones-content");
    console.log(medicionesContent);

    //console.log("mostrarMediciones()");
    let promesa = laLogica.recuperarMediciones().then((mediciones) => {
        if (mediciones) {
            medicionesContent.innerHTML = "";
            mediciones.forEach((medicion) => {
                //console.log(medicion);
                let row = document.createElement("div");
                row.classList.add("row");

                let divHora = document.createElement("div");
                divHora.innerText = medicion.momento
                    .toString()
                    .replace("T", "  ")
                    .replace("Z", "  ");
                divHora.classList.add("cell");
                let divValor = document.createElement("div");
                divValor.innerText = medicion.valor;
                divValor.classList.add("cell");

                let divUbicacion = document.createElement("div");
                divUbicacion.innerText =
                    "lat: " + medicion.ubicacion.x + ", lng: " + medicion.ubicacion.y;
                divUbicacion.classList.add("cell");

                row.append(divHora);
                row.append(divValor);
                row.append(divUbicacion);
                medicionesContent.appendChild(row);
            });
        } else {
        }
    });
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