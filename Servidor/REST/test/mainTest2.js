// ........................................................
// mainTest1.js
// ........................................................

var request = require("request");
var assert = require("assert");

const IP_PUERTO = "http://localhost:8080";

describe("Test 2: Todos los post", function () {
    var idUsuario = null;

    it("probar POST /usuario", function (hecho) {
        var datosUsuario = {
            nombreUsuario: "admin",
            contrasenya: "ContraseñaHasheada",
            correo: "micorreo@gmail.com",
            telefono: "123456789",
            idNodo: "1"
        };

        request.post({
                url: IP_PUERTO + "/usuario",
                headers: {
                    "User-Agent": "David",
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(datosUsuario),
            },

            function (err, respuesta, carga) {
                idUsuario = JSON.parse(carga).id;
                res = JSON.stringify({
                    id: idUsuario,
                    nombre_usuario: "admin",
                    contrasenya: "ContraseñaHasheada",
                    correo: "micorreo@gmail.com",
                    puntuacion: 0,
                    telefono: "123456789",
                    id_nodo: "1",
                    puntos_canjeables: 0
                });
                assert.equal(err, null, "¿ha habido un error?");
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)");
                assert.equal(carga, res, "¿La carga no es " + res);
                hecho();
            } // callback
        ); // .post
    }); // it

    it("probar POST /login", function (hecho) {
        var datosUsuario = {
            nombreUsuario: "admin",
            contrasenya: "ContraseñaHasheada",
        };

        request.post({
                url: IP_PUERTO + "/login",
                headers: {
                    "User-Agent": "David",
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(datosUsuario),
            },

            function (err, respuesta, carga) {
                res = JSON.stringify({
                    existe: true,
                    id: idUsuario,
                });
                assert.equal(err, null, "¿ha habido un error?");
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)");
                assert.equal(carga, res, "¿La carga no es " + res);
                hecho();
            } // callback
        ); // .post
    }); // it

    it("probar POST /medicion", function (hecho) {
        var datosMedicion = {
            valor: 12345,
            momento: "2020-11-22 05:00:00",
            ubicacion: "98.92999, 45",
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
                res = JSON.stringify({
                    valor: 12345,
                    momento: "2020-11-22T04:00:00.000Z",
                    ubicacion: "98.92999, 45",
                    tipoMedicion: "CO2",
                });

                assert.equal(err, null, "¿ha habido un error?");
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)");
                assert.equal(carga, res, "¿La carga no es " + res);
                hecho();
            } // callback
        ); // .post
    }); // it
}); //describe
