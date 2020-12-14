var request = require('request')
var assert = require('assert')
const { isMainThread } = require('worker_threads')
const { json } = require('express')

const IP_PUERTO = "http://localhost:8080"

describe("Test 1 : Recuerda arrancar el servidor", function () {
    
    it("probar que GET /prueba responde ¡Funciona!", function (hecho) {
        
        request.get({
            
                url: IP_PUERTO + "/prueba",
                headers: {
                    
                    'User-Agent': 'David'
                }
            },
                    
            function (err, respuesta, carga) {
            
                assert.equal(err, null, "¿ha habido un error?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
                assert.equal(carga, "¡Funciona!", "¿La carga no es ¡Funciona!?")
                hecho()
            } // callback()
        ) // .get
    }) // it
})