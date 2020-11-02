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
    // datos:{id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, Puntuacion:Z}
    // ...............................................................................
    buscarUsuarioConNombreYContrasenya(datos) {

        var textoSQL = "select * from usuarios where nombre_usuario= ? and contrasenya= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.nombreUsuario, datos.contrasenya], (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }
    
    actualizarUsuario(){
        
    }

    // ...............................................................................
    // datos:{idUsuario:Z, valor:Real, momento:Datetime, ubicacion:Punto, tipoMedicion:Texto}
    // -->
    // insertarMedicion() -->
    // ...............................................................................
    insertarMedicion(datos) {

        var textoSQL = 'insert into mediciones values(?, ?, ?, ?);'

        return new Promise((resolver, rechazar) => {

            this.laConexion.query(textoSQL, [datos.valor, datos.momento, datos.ubicacion, datos.tipoMedicion], function (err) {

                (err ? rechazar(err) : resolver())
            })
        })
        
        var textoSQL2 = 'insert into medicionesdeusuarios values(?, ?, ?);'

        return new Promise((resolver, rechazar) => {

            this.laConexion.query(textoSQL2, [datos.idUsuario, datos.momento, datos.ubicacion], function (err) {

                (err ? rechazar(err) : resolver())
            })
        })
        
    } // ()

    // ...............................................................................
    //datos:{momento:Datetime, ubicacion:Punto, idUsuario:Z}
    // -->
    // buscarMedicionConMomentoYUbicacion() <--
    // <--
    // datos:{valor:Real, momento:Datetime, ubicacion:Punto, tipoMedicion:Texto}
    // ...............................................................................
    buscarMedicionConMomentoYUbicacion(datos) {

        var textoSQL = "select valor,momento,ubicacion,tipoMedicion from mediciones, medicionesdeusuarios where momento= ? and ubicacion= ? and id_usuario= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.momento, datos.ubicacion, datos.idUsuario], (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }
    
    buscarMedicionDeUsuario(idUsuario){
        
        var textoSQL = "select * from medicionesdeusuarios where idusuario= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [idUsuario], (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }

    async buscarMedicionesDeUsuario(id){
                
        ubicacionesYMomentos= await this.buscarMedicionDeUsuario(id);
        //Añadir a una lista los diferentes valores de buscarMedicionConMomentoYUbicacion y retornar
        
    }
    
    buscarTodasLasMediciones(){
        
        var textoSQL = "select * from mediciones";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, (err, res) => {
                (err ? rechazar(err) : resolver(res))
            })
        })
    }
    
    buscarTipoMedidicionConID(id){
        
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
