// .....................................................................
// mainServidorREST.js
// .....................................................................

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Logica = require("../Logica/Logica.js");

function cargarLogica(fichero) {
    return new Promise((resolver, rechazar) => {
        var laLogica = new Logica(fichero, function (err) {
            if (err) {
                rechazar(err);
            } else {
                resolver(laLogica);
            }
        }); // new
    }); // Promise
} // ()

// .....................................................................
// main()
// .....................................................................

async function main() {
    var laLogica = await cargarLogica("proyecto3a");

    // creo el servidor
    var servidorExpress = express();
    servidorExpress.use(cors());

    // para poder acceder a la carga de la petición http asumiendo que es JSON
    servidorExpress.use(bodyParser.text({
        type: "application/json"
    }));

    // cargo las reglas REST
    var reglas = require("./ReglasREST.js");
    reglas.cargar(servidorExpress, laLogica);

    // arranco el servidor
    var servicio = servidorExpress.listen(8080, function () {
        console.log("servidor REST escuchando en el puerto 8080 ");
    });

    //Llama al Matlab cada hora que crea un JSON en el servidor
    setInterval(async function () {
        
        //Obtenemos las mediciones de las ultimas dos horas
    await laLogica.parsearMediciones()
        
        //Llamamos a la función del matlab
        
        
//    }, 1000*60*60*2)
    }, 1000*90)

    // capturo control-c para cerrar el servicio ordenadamente
    process.on("SIGINT", function () {
        console.log(" terminando ");
        servicio.close();
        process.exit(1);
    });
} // ()

main();
