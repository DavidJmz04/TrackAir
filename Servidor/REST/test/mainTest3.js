// ........................................................
// mainTest2.js
// ........................................................

var request = require('request')
var assert = require('assert')
var idUsuario = null;

const IP_PUERTO = "http://localhost:8080"

describe("Test 3: Todos los get", function () {

    it("probar GET /mediciones", function (hecho) {

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
            })

        request.get({

                url: IP_PUERTO + "/mediciones",
                headers: {

                    'User-Agent': 'David'
                }
            },

            function (err, respuesta, carga) {
                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")

                var solucion = JSON.parse(carga)

                assert.equal(solucion[0].valor, 12345, "¿El valor no es 12345?")
                assert.equal(solucion[0].momento, "Sun Nov 22 2020 05:00:00 GMT+0100 (GMT+01:00)", "¿El momento no es Sun Nov 22 2020 05:00:00 GMT+0100 (GMT+01:00)?")
                assert.equal(solucion[0].ubicacion, "98.92999, 45", "¿La ubicación no es 98.92999, 45?")
                assert.equal(solucion[0].tipoMedicion, "CO2", "¿El tipo de medición no es CO2?")

                hecho()
            } // callback
        ) // .get
    }) // it

    it("probar GET /mediciones/:idUsuario", function (hecho) {

        request.get({

                url: IP_PUERTO + "/mediciones/" + idUsuario,
                headers: {

                    'User-Agent': 'David'
                }
            },

            function (err, respuesta, carga) {

                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")

                var solucion = JSON.parse(carga)

                assert.equal(solucion[0].valor, 12345, "¿El valor no es 12345?")
                assert.equal(solucion[0].momento, "2020-11-22T04:00:00.000Z", "¿El momento no es 2018-10-22T04:00:00.000Z?")
                assert.equal(solucion[0].ubicacion, "98.92999, 45", "¿La ubicación no es 98.92999, 45?")
                assert.equal(solucion[0].tipoMedicion, "CO2", "¿El tipo de medición no es CO2?")

                hecho()
            } // callback
        ) // .get
    }) // it

    it("probar GET /tipoMedicion/:idMedicion", function (hecho) {

        request.get({

                url: IP_PUERTO + "/tipoMedicion/CO2",
                headers: {

                    'User-Agent': 'David'
                }
            },

            function (err, respuesta, carga) {

                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")

                var solucion = JSON.parse(carga)

                assert.equal(solucion.id, "CO2", "¿El id no es CO2?")
                assert.equal(solucion.descripcion, "Dióxido de carbono ir a real silent killer", "¿La descripción no es: Dióxido de carbono ir a real silent killer?")
                assert.equal(solucion.limite_max, 426, "¿El limite no es 426?")

                hecho()
            } // callback
        ) // .get
    }) // it

    it("probar GET /usuario/:idUsuario", function (hecho) {

        request.get({

                url: IP_PUERTO + "/usuario/" + idUsuario,
                headers: {

                    'User-Agent': 'David'
                }
            },

            function (err, respuesta, carga) {

                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")

                var solucion = JSON.parse(carga)

                assert.equal(solucion.id, idUsuario, "¿El id no es " + idUsuario + "?")
                assert.equal(solucion.nombre_usuario, "admin", "¿El nombre de usuario no es admin?")
                assert.equal(solucion.contrasenya, "ContraseñaHasheada", "¿La contraseña no es ContraseñaHasheada?")
                assert.equal(solucion.correo, "micorreo@gmail.com", "¿La contraseña no es micorreo@gmail.com?")
                assert.equal(solucion.puntuacion, 0, "¿La puntuación no es 0?")

                hecho()
            } // callback
        ) // .get
    }) // it

    it("probar GET /distanciaYTiempoUsuario", function (hecho) {

        var datosMedicion = {
            valor: 12345,
            momento: "2020-11-22 05:15:00",
            ubicacion: "98.94, 45",
            tipoMedicion: "CO2",
            idUsuario: idUsuario,
        };

        request.post({
                url: IP_PUERTO + "/medicion",
                headers: {
                    "User-Agent": "David",
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(datosMedicion),
            },

            function (err, respuesta, carga) {
            } // callback
        ); // .post

        request.get({

                url: IP_PUERTO + "/distanciaYTiempoUsuario",
                headers: {

                    'User-Agent': 'David'
                }
            },

            function (err, respuesta, carga) {

                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")

                var solucion = JSON.parse(carga)

                assert.equal(solucion[0].id, idUsuario, "¿El id no es " + idUsuario + "?")
                assert.equal(solucion[0].nombreUsuario, "admin", "¿El nombre de usuario no es admin?")
                assert.equal(solucion[0].correo, "micorreo@gmail.com", "¿La contraseña no es micorreo@gmail.com?")
                assert.equal(solucion[0].telefono, "123456789", "¿El telefono no es 123456789?")
                assert.equal(solucion[0].idNodo, "1", "¿El id del nodo no es 1?")
                assert.equal(solucion[0].distancia, 1113.0612157113746, "¿La distancia no es 1113.0612157113746?")
                assert.equal(solucion[0].tiempo, "900", "¿El tiempo no es 900s?")
                hecho()
            } // callback
        ) // .get
    }) // it

    it("probar GET /recompensas", function (hecho) {

        request.get({

                url: IP_PUERTO + "/recompensas",
                headers: {

                    'User-Agent': 'David'
                }
            },

            function (err, respuesta, carga) {

                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")

                var solucion = JSON.parse(carga)

                assert.equal(solucion[0].id, 3, "¿El id no es 1?")
                assert.equal(solucion[0].titulo, "Cine", "¿El titulo no es Cine?")
                assert.equal(solucion[0].descripcion, "Entrada de cine", "¿La descripción no es: Entrada de cine?")
                assert.equal(solucion[0].coste, 18000, "¿El coste no es 8000?")


                hecho()
            } // callback
        ) // .get
    }) // it

    it("probar GET /codigoRecompensa/:idRecompensa", function (hecho) {

        request.get({

                url: IP_PUERTO + "/codigoRecompensa/3",
                headers: {

                    'User-Agent': 'David'
                }
            },

            function (err, respuesta, carga) {

                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")

                var solucion = JSON.parse(carga)

                assert.equal(solucion.id_recompensa, 3, "¿El id no es 3?")
                assert.equal(solucion.codigo, "000000001", "¿El codigo no es 000000001?")

                hecho()
            } // callback
        ) // .get
    }) // it
}) //describe
