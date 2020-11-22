// ........................................................
// mainTest2.js
// ........................................................

var request = require('request')
var assert = require('assert')
var idUsuario = null

const IP_PUERTO = "http://localhost:8080"

describe("Test 4: Todos los put", function () {

    it("obtener idUsuario", function (hecho) {

        var datosUsuario = {

            nombreUsuario: "admin",
            contrasenya: "ContraseñaHasheada",
        }

        request.post({

                url: IP_PUERTO + "/login",
                headers: {

                    'User-Agent': 'David',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(datosUsuario)
            },

            function (err, respuesta, carga) {

                idUsuario = JSON.parse(carga).id
                hecho()

            } // callback
        ) // .post        
    })

    it("probar PUT /editarUsuario", function (hecho) {

        var datosPersona = {

            id: idUsuario,
            nombreUsuario: "David",
            contrasenya: "ContraseñaHasheada",
            correo: "micorreo@gmail.com",
            puntuacion: 0,
            telefono: "123456789",
            idNodo: "1",
            puntosCanjeables: 0
        }

        request.put({

                url: IP_PUERTO + "/editarUsuario",
                headers: {

                    'User-Agent': 'Datos',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(datosPersona)
            },

            function (err, respuesta, carga) {

                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
                assert.equal(carga, "Se ha actualizado correctamente el usuario:David", "¿La carga no es esa?")
                hecho()
            } // callback
        ) // .delete
    }) // it
}) //describe
