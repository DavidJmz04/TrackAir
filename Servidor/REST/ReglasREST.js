// .....................................................................
// ReglasREST.js
// .....................................................................

const utilidades = require("../Logica/Utilidades.js");

module.exports.cargar = function (servidorExpress, laLogica) {
    
    var utilidad = new utilidades();
    var csv = require('../Datos/MedicionesOficiales.json'); // your json file path
    // .......................................................
    // GET /prueba
    // .......................................................
    servidorExpress.get('/prueba/', function (peticion, respuesta) {

        console.log(" * GET /prueba ")

        respuesta.send("¡Funciona!")
    }) // get /prueba

    // .......................................................
    // GET /mediciones
    // .......................................................
    servidorExpress.get('/mediciones', async function (peticion, respuesta) {

        console.log(" * GET /mediciones ")

        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarTodasLasMediciones();
        // si el array de resultados no tiene una casilla ...
        if (res.length == 0) {
            // 404: not found
            respuesta.status(404).send("No encontré la medicion")
            return
        }
        var json = utilidad.procesarCalidadAireAJSON(res);
        // todo ok
        respuesta.send(json)
    }) // get /mediciones

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
    // POST /medicion
    // .......................................................
    servidorExpress.post('/medicion', async function (peticion, respuesta) {

        console.log(" * POST /medicion ")

        var datos = JSON.parse(peticion.body)

        await laLogica.insertarMedicion(datos)
        var res = await laLogica.buscarMedicionConMomentoYUbicacion(datos)

        // supuesto procesamiento
        if (res.length != 1) {

            respuesta.status(404).send("No se ha podido insertar la medicion")
            return
        }

        respuesta.send(JSON.stringify(res[0]))
    }) // post /medicion

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
        respuesta.send(JSON.stringify(res[0]))
    }) // get /tipoMedicion/:idMedicion

    // .......................................................
    // GET /usuario/
    // .......................................................
    servidorExpress.get('/usuario/:idUsuario', async function (peticion, respuesta) {

        console.log(" * GET /usuario/:idUsuario ")

        // averiguo el id
        var id = peticion.params.idUsuario
        // llamo a la función adecuada de la lógica
        var res = await laLogica.buscarUsuarioConId(id)

        if (res.length != 1) {
            // 404: not found
            respuesta.status(404).send("No encontré el usuario")
            return
        }
        // todo ok
        respuesta.send(JSON.stringify(res[0]))
    }) // get /usuario

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
    // PUT /editarUsuario
    // .......................................................
    servidorExpress.put('/editarUsuario', async function (peticion, respuesta) {

        console.log(" * PUT /editarUsuario ")

        var datos = JSON.parse(peticion.body)
        var res = await laLogica.editarUsuario(datos)

        respuesta.send("Se ha actualizado correctamente el usuario:" + datos.nombreUsuario);
    }) // put /editarUsuario 
    
    // .......................................................
    // PUT /puntuacionUsuario
    // .......................................................
    servidorExpress.put('/puntuacionUsuario', async function (peticion, respuesta) {

        console.log(" * POST /puntuacionUsuario ")

        var datos = JSON.parse(peticion.body)
        // averiguo el id
        var id = datos.idUsuario

        // llamo a la función adecuada de la lógica
        var res = await laLogica.obtenerPuntuacion(id)

        await laLogica.editarPuntuacionUsuario({puntuacion: res, id: id})

        respuesta.send("Se han actualizado los datos de puntuacion");
    }) // put /puntuacionUsuario

    // .......................................................
    // POST /login/
    // .......................................................
    servidorExpress.post('/login', async function (peticion, respuesta) {

        console.log(" * POST /login ")

        var datos = JSON.parse(peticion.body)
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
        respuesta.send(JSON.stringify(res[0]))
    }) // get /codigoRecompensa

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
        const fetch = require("node-fetch");
        console.log(" * GET /mediciones oficiales")

        const options = {
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
        fetch("https://webcat-web.gva.es/webcat_web/datosOnlineRvvcca/obtenerTablaPestanyaDatosOnline", options)
            .then(response => response.text())
            .then(data => {

                if (data.length == 0) {
                    // 404: not found
                    respuesta.status(404).send("{}")
                    return
                }
                // todo ok
                respuesta.send(data.valor)

            });
    }) // get /mediciones
} // cargar()
