// .....................................................................
// ReglasREST.js
// .....................................................................

const utilidades = require("../Logica/Utilidades.js");
const path = require('path');
const pdf = require("pdf-creator-node");
const fs = require("fs");

module.exports.cargar = function (servidorExpress, laLogica) {
    var utilidad = new utilidades();
    var csv = require("../Datos/MedicionesOficiales.json"); // your json file path
    var online = require("../Datos/MedicionesOficialesOnline.json"); // your json file path
    var calibrar = false;
    // .......................................................
    // GET /prueba
    // .......................................................
    servidorExpress.get("/prueba/", function (peticion, respuesta) {
        console.log(" * GET /prueba ");
        respuesta.send("¡Funciona!");
    }); // get /prueba

    // .......................................................
    // GET /mediciones
    // .......................................................
    servidorExpress.get("/mediciones", async function (peticion, respuesta) {
        console.log(" * GET /mediciones ");

        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarTodasLasMediciones();
        // si el array de resultados no tiene una casilla ...
        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré la medicion");
            return;
        }
        var json = utilidad.procesarCalidadAireAJSON(res);
        // todo ok
        respuesta.send(json);
    }); // get /mediciones

    // .......................................................
    // GET /mediciones/:idUsuario
    // .......................................................
    servidorExpress.get('/mediciones/:idUsuario', async function (peticion, respuesta) {

        console.log(" * GET /mediciones/:idUsuario ")

        // averiguo el id
        var id = peticion.params.idUsuario
        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarMedicionesDeUsuario(id)
        //Si el array esta vacío
        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré la medicion")
            return
        }
        // todo ok
        respuesta.send(JSON.stringify(res))
    }) // get /mediciones/:idUsuario

    // .......................................................
    // GET /mediciones oficiales off line
    // .......................................................
    servidorExpress.get('/medicionesOficialesCSV', async function (peticion, respuesta) {
        // Do something with your data
        respuesta.send(utilidad.convertirAJSONpropio(csv));
    }) // get /mediciones

    // .......................................................
    // GET /mediciones oficiales en línea
    // .......................................................
    servidorExpress.get('/medicionesOficiales', async function (peticion, respuesta) {

        console.log(" * GET /mediciones oficiales")
        respuesta.send(require("../Datos/MedicionesOficialesOnline.json")); // your json file path)
    }); // get /mediciones

    // .......................................................
    // GET /mediciones oficiales en línea
    // .......................................................
    servidorExpress.get('/medicionesOficialesUltimaO3', async function (peticion, respuesta) {

        console.log(" * GET /mediciones oficiales")
        var file = require("../Datos/MedicionesOficialesOnline.json");
        var result = "";
        console.log(file)
        file.mediciones.forEach(element => {
            if(element.contaminante=="O3") 
                result = '["' + element.contaminacion + '", "' + element.hora + '"'
        });
        result +="]"
        respuesta.send(result); // your json file path)
    }); // get /mediciones

    // .......................................................
    // GET /lecturas/:tipoGas
    // .......................................................
    servidorExpress.get('/lecturas/:tipoGas', async function (peticion, respuesta) {

        console.log(" * GET /lecturas/:tipoGas ")

        // averiguo el id
        var tipoGas = peticion.params.tipoGas
        // llamo a la función adecuada de la lógica
        var res = await laLogica.obtenerLecturas(tipoGas)
        //Si el array esta vacío
        //        if (res.length == 0) {
        // 404: not found
        //            respuesta.status(404).send("No encontré la lectura")
        //            return
        //        }
        // todo ok
        respuesta.send(JSON.stringify(res))
    }) // get /mediciones/:idUsuario

    // .......................................................
    // GET /calidadAire/:idUsuario
    // .......................................................
    servidorExpress.get("/calidadAire/:idUsuario", async function (peticion, respuesta) {
        console.log(" * GET /calidadAire/:idUsuario ");

        // averiguo el id
        var id = peticion.params.idUsuario;
        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarMedicionesDeUsuarioDeHoy(id);
        //Si el array esta vacío
        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré mediciones");
            return;
        }
        res = await utilidad.procesarCalidadAireAJSON(res);
        // todo ok
        respuesta.send(res);
    }); // get /mediciones/:idUsuario

    // .......................................................
    // GET /tipoMedicion/:idMedicion
    // .......................................................
    servidorExpress.get('/tipoMedicion/:idMedicion', async function (peticion, respuesta) {

        console.log(" * GET /tipoMedicion/:idMedicion ")

        // averiguo el id
        var id = peticion.params.idMedicion
        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarTipoMedicionConID(id)
        //Si no encuentra el tipo de medicion
        if (res.length != 1) {
            // 404: not found
            respuesta.status(404).send("No encontré el tipo de medicion")
            return
        }
        // todo ok
        respuesta.send(JSON.stringify(res))
    }) // get /tipoMedicion/:idMedicion

    // .......................................................
    // GET /usuario/:idUsuario
    // .......................................................
    servidorExpress.get("/usuario/:idUsuario", async function (peticion, respuesta) {
        console.log(" * GET /usuario/:idUsuario ");

        // averiguo el id
        var id = peticion.params.idUsuario;
        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarUsuarioConId(id);

        if (res.length != 1) {
            // 404: not found
            respuesta.status(404).send("No encontré el usuario");
            return;
        }
        // todo ok
        respuesta.send(JSON.stringify(res));
    }); // get /usuario/:idUsuario

    // .......................................................
    // GET /usuarios
    // .......................................................
    servidorExpress.get("/usuarios", async function (peticion, respuesta) {
        console.log(" * GET /usuarios");

        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarUsuarios();

        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré usuarios");
            return;
        }
        // todo ok
        respuesta.send(JSON.stringify(res));
    }); // get /usuarios

    // .......................................................
    // GET /distanciaYTiempoUsario/
    // .......................................................
    servidorExpress.get('/distanciaYTiempoUsuario', async function (peticion, respuesta) {

        console.log(" * GET /distanciaYTiempoUsuario ")

        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarDistanciaYTiempoDeUsuarios()

        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré usuarios")
            return
        }
        // todo ok
        respuesta.send(JSON.stringify(res))
    }) // get /usuario

    // .......................................................
    // GET /recompensas/
    // .......................................................
    servidorExpress.get('/recompensas', async function (peticion, respuesta) {

        console.log(" * GET /recompensas ")

        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarRecompensas()

        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré recompensas")
            return
        }
        // todo ok
        respuesta.send(JSON.stringify(res))
    }) // get /recompensas

    // .......................................................
    // GET /codigoRecompensa/
    // .......................................................
    servidorExpress.get('/codigoRecompensa/:idRecompensa', async function (peticion, respuesta) {

        console.log(" * GET /codigoRecompensa/:idRecompensa ")

        // averiguo el id
        var id = peticion.params.idRecompensa

        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarCodigoRecompensaConId(id)

        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré recompensas")
            return
        }
        // todo ok
        respuesta.send(JSON.stringify(res))
    }) // get /codigoRecompensa

    // .......................................................
    // GET /informe/ranking
    // .......................................................
    servidorExpress.get("/informe/ranking", async function (peticion, respuesta) {
        console.log(" * GET /informe/ranking ");

        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarUsuariosOrdenadosPorPuntuación();
        //console.log(res);

        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré usuarios");
            return;
        }
        console.log(process.cwd());
        // todo ok
        // Read HTML Template
        var html = fs.readFileSync("plantillaRanking.html", "utf8");

        var options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "10mm",
                contents: '<div style="text-align: center; color:#03E2A2;"><h2>TrackAir</h2></div>',
            },
            footer: {
                height: "10mm",
                contents: {
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                },
            },
        };
        var document = {
            html: html,
            data: {
                users: res,
            },
            path: `./ranking.pdf`,
        };

        pdf
            .create(document, options)
            .then((res) => {
                //console.log(res);
                return res.filename;
            })
            .then((filename) => {
                respuesta.contentType("application/pdf");
                let date = new Date();
                respuesta.download(
                    path.join(__dirname, "/ranking.pdf"),
                    `Ranking-${date.toString()}.pdf`
                );
            })
            .catch((error) => {
                console.error(error);
                res.statusCode = 404;
            });
    }); // get /informe/ranking

    // .......................................................
    // GET /informe/uso
    // .......................................................
    servidorExpress.get("/informe/uso/:primerDia", async function (peticion, respuesta) {

        console.log(" * GET /informe/uso/:primerDia ");

        // averiguo el primerDia del intervalo
        var primerDia = peticion.params.primerDia

        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarDistanciaYTiempoDeUsuarios(primerDia);
        console.log(res);

        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré usuarios");
            return;
        }
        // todo ok
        // Read HTML Template
        var html = fs.readFileSync("plantillaInformeUso.html", "utf8");

        var options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "10mm",
                contents: '<div style="text-align: center; color:#03E2A2;"><h2>TrackAir</h2></div>',
            },
            footer: {
                height: "10mm",
                contents: {
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                },
            },
        };
        var document = {
            html: html,
            data: {
                users: res,
            },
            path: `./uso.pdf`,
        };

        pdf
            .create(document, options)
            .then((res) => {
                console.log(res);
                return res.filename;
            })
            .then((filename) => {
                respuesta.contentType("application/pdf");
                let date = new Date();
                respuesta.download(
                    path.join(__dirname, "/uso.pdf"),
                    `Uso-${date.toString()}.pdf`
                );
            })
            .catch((error) => {
                console.error(error);
                res.statusCode = 404;
            });
    }); // get /informe/uso
    
    // .......................................................
    // GET /informe/nodos
    // .......................................................
    servidorExpress.get("/informe/nodos", async function (peticion, respuesta) {

        console.log(" * GET /informe/nodos ");


        // llamo a la función adecuada de la lógica
        var resUltimasMediciones = await laLogica.buscarNodosInactivos();

        // llamo a la función adecuada de la lógica
        var resErrorMediciones = await laLogica.buscarNodosConFallos();
        console.log(resUltimasMediciones);

        // todo ok
        // Read HTML Template
        var html = fs.readFileSync("plantillaInformeNodos.html", "utf8");

        var options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "10mm",
                contents: '<div style="text-align: center; color:#03E2A2;"><h2>TrackAir</h2></div>',
            },
            footer: {
                height: "10mm",
                contents: {
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                },
            },
        };
        var document = {
            html: html,
            data: {
                inactivos: resUltimasMediciones,
                fallos: resErrorMediciones
            },
            path: `./nodos.pdf`,
        };

        pdf
            .create(document, options)
            .then((res) => {
                console.log(res);
                return res.filename;
            })
            .then((filename) => {
                respuesta.contentType("application/pdf");
                let date = new Date();
                respuesta.download(
                    path.join(__dirname, "/nodos.pdf"),
                    `Nodo-${date.toString()}.pdf`
                );
            })
            .catch((error) => {
                console.error(error);
                res.statusCode = 404;
            });
    }); // get /informe/nodos

    // .......................................................
    // POST /medicion
    // .......................................................
    servidorExpress.post('/medicion', async function (peticion, respuesta) {

        console.log(" * POST /medicion ")

        var datos = JSON.parse(peticion.body)

        // Procesado de la medicion
        var sensor = await laLogica.buscarSensorPertenecienteA(datos.idUsuario)
        // supuesto procesamiento
        if (sensor.length > 0) {
            var error = sensor[0].error;
            var medicion = datos.valor;
            var medicionConError = medicion * (1 / error);
            var ultimaMedicionOficial = utilidad.getUltimaMedicionOficial(online);
            console.log(ultimaMedicionOficial + " - " + medicionConError + " _-_ " + (ultimaMedicionOficial + ultimaMedicionOficial * 0.2))
            if (medicionConError > (ultimaMedicionOficial + ultimaMedicionOficial * 0.2) | medicionConError < (ultimaMedicionOficial - ultimaMedicionOficial * 0.2)) {
                //if ((ultimaMedicionOficial - ultimaMedicionOficial * 0.2) < medicionConError)
                if (calibrar) {
                    error = medicionConError / ultimaMedicionOficial;
                    await laLogica.modificarErrorSensor(sensor[0].id_nodo, error);
                    var medicionConError = medicion * (1 / error);
                    calibrar = false;
                } else {
                    calibrar = true;
                }
            }
            datos.valor = (medicionConError < 0 ? 0 : medicionConError);
            await laLogica.insertarMedicion(datos);
            var res = await laLogica.buscarMedicionConMomentoYUbicacion(datos)

            // supuesto procesamiento
            if (res.length != 1) {

                respuesta.status(404).send("No se ha podido insertar la medicion")
                return
            }

            respuesta.send(JSON.stringify(res[0]))
        } else {
            respuesta.status(404).send("No se ha encontrado sensor")
            return
        }
    }) // post /medicion

    // .......................................................
    // POST /usuario
    // .......................................................
    servidorExpress.post('/usuario', async function (peticion, respuesta) {

        console.log(" * POST /usuario ")

        var datos = JSON.parse(peticion.body)

        await laLogica.insertarUsuario(datos)
        var res = await laLogica.buscarUsuarioConNombreYContrasenya(datos)

        // Si no encuentra el usuario
        if (res.length != 1) {

            respuesta.status(404).send("No se ha podido insertar el usuario")
            return
        }

        respuesta.send(JSON.stringify(res[0]))
    }) // post /usuario  

    // .......................................................
    // POST /login/
    // .......................................................
    servidorExpress.post('/login', async function (peticion, respuesta) {

        console.log(" * POST /login ")

        var datos = JSON.parse(peticion.body)
        console.log(datos)
        // llamo a la función adecuada de la lógica
        var usuario = await laLogica.buscarUsuarioConNombreYContrasenya(datos)

        //Si existe el usuario devolvemos true
        if (usuario.length == 1) respuesta.send(JSON.stringify({
            existe: true,
            id: usuario[0].id
        }))
        else respuesta.send(JSON.stringify({
            existe: false
        }))
    }) // post /login

    // .......................................................
    // PUT /editarUsuario
    // .......................................................
    servidorExpress.put('/editarUsuario', async function (peticion, respuesta) {

        console.log(" * PUT /editarUsuario ")

        var datos = JSON.parse(peticion.body)
        var res = await laLogica.editarUsuario(datos)

        respuesta.send(JSON.stringify("Se ha actualizado correctamente el usuario:" + datos.nombreUsuario));
    }) // put /editarUsuario 

    // .......................................................
    // PUT /puntuacionUsuario
    // .......................................................
    servidorExpress.put('/puntuacionUsuario', async function (peticion, respuesta) {

        console.log(" * PUT /puntuacionUsuario ")

        var datos = JSON.parse(peticion.body)
        // averiguo el id
        var id = datos.idUsuario

        // llamo a la función adecuada de la lógica
        var res = await laLogica.obtenerPuntuacion(id)

        await laLogica.editarPuntuacionUsuario({
            puntuacion: res,
            id: id
        })

        respuesta.send(JSON.stringify("Se han actualizado los datos de puntuacion"));
    }) // put /puntuacionUsuario

    // .......................................................
    // DELETE /borrarUsuario
    // .......................................................
    servidorExpress.delete('/borrarUsuario', async function (peticion, respuesta) {

        console.log(" * DELETE /borrarUsuario ")

        var datos = JSON.parse(peticion.body)
        // averiguo el id
        var id = datos.id

        await laLogica.borrarUsuario(id).catch(function () {

            respuesta.status(404).send("Error:no se ha podido borrar el usuario: " + JSON.stringify(datos.id));
        });

        var res = await laLogica.buscarUsuarioConId(datos.id);

        if (res.length == 0) respuesta.send("Se ha borrado satisfactoriamente");
    }) // delete /borrarUsuario
}; // cargar()
