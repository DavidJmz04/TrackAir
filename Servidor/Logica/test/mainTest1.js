// ........................................................
// mainTest1.js
// ........................................................

const Logica = require("../Logica.js")
var assert = require("assert")

// ........................................................
// main ()
// ........................................................

describe("Test 1: Usuario", function () {

    var laLogica = null
    var idUsuario = null

    it("conectar a la base de datos", function (hecho) {

        laLogica = new Logica("p3a", function (err) {

            if (err) {

                throw new Error("No he podido conectar con la base de datos")
            }

            hecho()
        })
    }) // it

    it("borrar todas las filas", async function () {

        await laLogica.borrarFilasDeTodasLasTablas()
    }) // it

    it("puedo insertar un usuario", async function () {

        await laLogica.insertarUsuario({
            nombreUsuario: "admin",
            contrasenya: "ContraseñaHasheada",
            correo: "micorreo@gmail.com",
            puntuacion: 200
        })

        var res = await laLogica.buscarUsuarioConNombreYContrasenya({
            nombreUsuario: "admin",
            contrasenya: "ContraseñaHasheada"
        })

        idUsuario = res[0].id

        assert.equal(res.length, 1, "¿no hay un resultado?")
        assert.equal(res[0].nombre_usuario.toString(), "admin", "¿no es ese nombre?")
        assert.equal(res[0].contrasenya.toString(), "ContraseñaHasheada", "¿no es esa contraseña?")
        assert.equal(res[0].correo.toString(), "micorreo@gmail.com", "¿no es ese correo?")
        assert.equal(res[0].puntuacion.toString(), "200", "¿no es esa puntuación?")
    }) // it

    it("puedo editar un usuario", async function () {

        await laLogica.editarUsuario({

            id: idUsuario,
            nombreUsuario: "David",
            contrasenya: "ContraseñaHasheada",
            correo: "micorreo@gmail.com",
            puntuacion: 200
        })

        var res = await laLogica.buscarUsuarioConId(idUsuario)
        assert.equal(res.length, 1, "No lo ha conseguido insertar")
    }) // it

    it("cerrar conexión a la base de datos", async function () {

        try {

            await laLogica.cerrar()

        } catch (err) {

            throw new Error("cerrar conexión a BD fallada: " + err)
        }
    }) // it
}) // describe
