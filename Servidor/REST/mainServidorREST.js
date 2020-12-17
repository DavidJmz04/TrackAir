// .....................................................................
// mainServidorREST.js
// .....................................................................

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Logica = require("../Logica/Logica.js");
const utilidades = require("../Logica/Utilidades.js");

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

function cargarMedicionesOficiales(){
  let fs = require("fs");
  let utilidad = new utilidades();
  let fetch = require("node-fetch");
        let options = {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                "idEstacion": 5
            }) // body data type must match "Content-Type" header
        };

        // Petición HTTP
        fetch("https://webcat-web.gva.es/webcat_web/datosOnlineRvvcca/obtenerEstacionById", options)
            .then(response => response.text())
            .then(data => {

                if (data.length == 0) {
                    // 404: not found
                    respuesta.status(404).send("{}")
                    return
                }
                // todo ok
                fetch("https://webcat-web.gva.es/webcat_web/datosOnlineRvvcca/obtenerTablaPestanyaDatosOnline", options)
                    .then(response => response.text())
                    .then(data => {
                        if (data.length == 0) {
                            // 404: not found
                            respuesta.status(404).send("{}")
                            return
                        }
                        // todo ok
                        
                        fs.writeFile("./Servidor/Datos/medicionesOficialesOnline.json", JSON.stringify(utilidad.convertirTiempoRealAJSONpropio((JSON.parse(data))['listMagnitudesMediasHorarias'])), function (err) {
                          if (err) console.log("Error")
                          else console.log("save")
                        })

                    });

            });
}

// .....................................................................
// main()
// .....................................................................

async function main() {
  var laLogica = await cargarLogica("proyecto3a");
  //cargarMedicionesOficiales();

  // creo el servidor
  var servidorExpress = express();
  servidorExpress.use(cors());

  // para poder acceder a la carga de la petición http asumiendo que es JSON
  servidorExpress.use(bodyParser.text({ type: "application/json" }));

  // cargo las reglas REST
  var reglas = require("./ReglasREST.js");
  reglas.cargar(servidorExpress, laLogica);

  // arranco el servidor
  var servicio = servidorExpress.listen(8080, function () {
    console.log("servidor REST escuchando en el puerto 8080 ");
  });


  setInterval(() => {
    // Petición HTTP
    cargarMedicionesOficiales();
  }, 3600000)

  // capturo control-c para cerrar el servicio ordenadamente
  process.on("SIGINT", function () {
    console.log(" terminando ");
    servicio.close();
    process.exit(1);
  });
} // ()

main();
