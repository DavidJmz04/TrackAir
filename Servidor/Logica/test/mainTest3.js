// ........................................................
// mainTest1.js
// ........................................................

const Logica = require("../Logica.js");
var assert = require("assert");
let idUsuario = null;
// ........................................................
// main ()
// ........................................................

describe("Test 3: Recompensas", function () {
    var laLogica = null;

    it("conectar a la base de datos", function (hecho) {
        laLogica = new Logica("proyecto3a", function (err) {
            if (err) {
                throw new Error("No he podido conectar con la base de datos");
            }

            hecho();
        });
    }); // it

    it("puedo buscar las recompensas", async function () {
        let res = await laLogica.buscarRecompensas();

        assert.equal(res.length, 2, "¿no hay un resultado?");
        assert.equal(res[0].titulo, "Cine", "¿no es ese titulo?");
        assert.equal(res[0].descripcion, "Entrada de cine", "¿no es esa descripcion?");
        assert.equal(res[0].coste.toString(), "18000", "¿no es ese coste?");
    }); // it

    it("puedo buscar los codigos de las recompensas", async function () {
        var res = await laLogica.buscarCodigoRecompensaConId(3);

        assert.equal(res.length, 1, "¿no hay un resultado?");
        assert.equal(res[0].codigo, "000000001", "¿no es ese codigo?");
    }); // it

    it("cerrar conexión a la base de datos", async function () {
        try {
            await laLogica.cerrar();
        } catch (err) {
            throw new Error("cerrar conexión a BD fallada: " + err);
        }
    }); // it
}); // describe
