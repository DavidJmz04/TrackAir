// .....................................................................
// Logica.js
// .....................................................................

const mysql = require("mysql")

// .....................................................................
// .....................................................................

module.exports = class Logica {

    // .................................................................
    // nombreBD: Texto
    // -->
    // constructor () -->
    // .................................................................
    constructor(nombreBD, cb) {

        this.laConexion = new mysql.createConnection({
            host: 'localhost',
            user: 'David',
            password: '1234',
            database: nombreBD
        })

        this.laConexion.connect(function (err) {

            if (err) throw err;
            console.log("Connected!");
            cb(this.laConexion)
        });

    } // ()

    // .................................................................
    // nombreTabla:Texto
    // -->
    // borrarFilasDe() -->
    // .................................................................

    borrarFilasDe(tabla) {

        return new Promise((resolver, rechazar) => {

            this.laConexion.query("delete from " + tabla + ";", (err) => (err ? rechazar(err) : resolver()))
        })
    } // ()

    // .................................................................
    // borrarFilasDeTodasLasTablas() -->
    // .................................................................

    async borrarFilasDeTodasLasTablas() {

        await this.borrarFilasDe("codigosrecompensas")
        await this.borrarFilasDe("tipomedidas")
        await this.borrarFilasDe("mediciones")
        await this.borrarFilasDe("usuarios")
        await this.borrarFilasDe("medicionesdeusuarios")
        await this.borrarFilasDe("recompensas")
    } // ()

    // ...............................................................................
    // datos:{nombreUsuario:Texto, contrasenya:Texto, correo:Texto, Puntuacion:Z}
    // -->
    // insertarUsuario() -->
    // ...............................................................................
    insertarUsuario(datos) {

        var textoSQL = 'insert into usuarios (nombre_usuario, contrasenya, correo, puntuacion) values(?, ?, ?, ?);'

        return new Promise((resolver, rechazar) => {

            this.laConexion.query(textoSQL, [datos.nombreUsuario, datos.contrasenya, datos.correo, datos.puntuacion], function (err) {

                (err ? rechazar(err) : resolver())
            })
        })
    } // ()

    // ...............................................................................
    //datos:{nombreUsuario:Texto, contrasenya=Texto}
    // -->
    // buscarUsuarioConId() <--
    // <--
    // {id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, Puntuacion:Z}
    // ...............................................................................
    buscarUsuarioConNombreYContrasenya(datos) {

        var textoSQL = "select * from usuarios where nombre_usuario= ? and contrasenya= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.nombreUsuario, datos.contrasenya], (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }
    
    // ...............................................................................
    //id:Z
    // -->
    // buscarUsuarioConId() <--
    // <--
    // {id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, Puntuacion:Z}
    // ...............................................................................
    buscarUsuarioConId(id) {

        var textoSQL = "select * from usuarios where id= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [id], (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }
    
    // ...............................................................................
    // datos:{id=Z, nombreUsuario:Texto, contrasenya=Texto, correo=Texto, puntuacion=Texto}
    // -->
    // editarUsuario() -->
    // ...............................................................................
    editarUsuario(datos) {
        
        var textoSQL = 'update usuarios set nombre_usuario= ?, contrasenya= ?, correo= ?, puntuacion=? where id=  ?;'

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.nombreUsuario, datos.contrasenya, datos.correo, datos.puntuacion, datos.id], function (err) {
                (err ? rechazar(err) : resolver())
            })
        })

    }

    // ...............................................................................
    // datos:{idUsuario:Z, valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // -->
    // insertarMedicion() -->
    // ...............................................................................
    //TODO: Hacer que funcione el insertar la tabla relacional 
    async insertarMedicion(datos) {

        var textoSQL = 'insert into mediciones values(?, ?, ?, ?);'
        return new Promise((resolver, rechazar) => {

            this.laConexion.query(textoSQL, [datos.valor, datos.momento, datos.ubicacion, datos.tipoMedicion], function (err) {

                if (!err) {

                    /*var textoSQL2 = 'insert into medicionesdeusuarios values(?, ?, ?);'
                    return new Promise((resolver, rechazar) => {

                        console.log(this)
                        this.laConexion.query(textoSQL2, [datos.idUsuario, datos.momento, datos.ubicacion], function (err) {

                            (err ? rechazar(err) : resolver())
                        })
                    })*/
                } else rechazar(err)
            })
        })
    } // ()

    //ESTO ES UN TEST DE LLAMARLO DESDE insertarMedicion(datos)
    insertarMedicionDeUsuario(datos) {

        var textoSQL = 'insert into medicionesdeusuarios values(?, ?, ?);'
        return new Promise((resolver, rechazar) => {

            this.laConexion.query(textoSQL, [datos.idUsuario, datos.momento, datos.ubicacion], function (err) {

                (err ? rechazar(err) : resolver())
            })
        })
    } // ()

    // ...............................................................................
    //datos:{momento:Datetime, ubicacion:Texto, idUsuario:Z}
    // -->
    // buscarMedicionConMomentoYUbicacion() <--
    // <--
    // {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ...............................................................................
    buscarMedicionConMomentoYUbicacion(datos) {

        var textoSQL = "select valor,momento,ubicacion,tipoMedicion from mediciones, medicionesdeusuarios where momento= ? and ubicacion= ? and id_usuario= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.momento, datos.ubicacion, datos.idUsuario], (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }

    // ...............................................................................
    //id:Z
    // -->
    // buscarMedicionesDeUsuario() <--
    // <--
    // Lista {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ...............................................................................
    async buscarMedicionesDeUsuario(id) {

        var ubicacionesYMomentos = await this.buscarUbicacionYMomentoDeUsuario(id);

        var res= [];
        for (var i = 0; i < ubicacionesYMomentos.length; i++) {
            
            var datos= {
                momento: ubicacionesYMomentos[i].momento_medicion,
                ubicacion: ubicacionesYMomentos[i].ubicacion_medicion,
                idUsuario: ubicacionesYMomentos[i].id_usuario,
            }            
            res.push(await this.buscarMedicionConMomentoYUbicacion(datos))
        }
        return res
    }
    
    // ...............................................................................
    //idUsuario:Z
    // -->
    // buscarUbicacionYMomentoDeUsuario() <--
    // <--
    // Lista {momento_medicion:Datetime, ubicacion_medicion:texto, id_usuario:Z}
    // ...............................................................................
    buscarUbicacionYMomentoDeUsuario(idUsuario) {

        var textoSQL = "select * from medicionesdeusuarios where id_usuario= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [idUsuario], (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }

    // ...............................................................................
    // buscarMedicionConMomentoYUbicacion() <--
    // <--
    // Lista {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ...............................................................................
    buscarTodasLasMediciones() {

        var textoSQL = "select * from mediciones";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }

    // ...............................................................................
    //id:Z
    // -->
    // buscarTipoMedidicionConID() <--
    // <--
    // {id:Z, descripcion:Texto, limite_max:R}
    // ...............................................................................
    buscarTipoMedidicionConID(id) {

        var textoSQL = "select * from tipomedida where id= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [id], (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }


    // .................................................................
    // cerrar() -->
    // .................................................................

    cerrar() {

        return new Promise((resolver, rechazar) => {

            this.laConexion.end((err) => {

                (err ? rechazar(err) : resolver())
            })
        })
    } // ()
} // class
