// ................................................................................................................................................
// Logica.js
// ................................................................................................................................................

const mysql = require("mysql");

// ................................................................................................................................................
// ................................................................................................................................................

module.exports = class Logica {
    // ................................................................................................................................................
    // nombreBD: Texto
    // -->
    // constructor () -->
    // ................................................................................................................................................
    constructor(nombreBD, cb) {
        this.laConexion = new mysql.createConnection({
            host: "localhost",
            user: "admin",
            password: "admin",
            database: nombreBD,
        });

        this.laConexion.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            cb(this.laConexion);
        });
    } // ()

    // ................................................................................................................................................
    // nombreTabla:Texto
    // -->
    // borrarFilasDe() -->
    // ................................................................................................................................................
    borrarFilasDe(tabla) {
        return new Promise((resolver, rechazar) => {
            this.laConexion.query("delete from " + tabla + ";", (err) =>
                err ? rechazar(err) : resolver()
            );
        });
    } // ()

    // ................................................................................................................................................
    // borrarFilasDeTodasLasTablas() -->
    // ................................................................................................................................................

    async borrarFilasDeTodasLasTablas() {
        // await this.borrarFilasDe("codigosrecompensas");
        await this.borrarFilasDe("mediciones");
        //await this.borrarFilasDe("tipomedida");
        await this.borrarFilasDe("usuarios");
        await this.borrarFilasDe("medicionesdeusuarios");
        // await this.borrarFilasDe("recompensas");
    } // ()

    // ................................................................................................................................................
    // datos:{nombreUsuario:Texto, contrasenya:Texto, correo:Texto, puntuacion:Z, telefono=Texto, idNodo=Texto}
    // -->
    // insertarUsuario() -->
    // ...............................................................................
    insertarUsuario(datos) {
        var textoSQL =
            "insert into usuarios (nombre_usuario, contrasenya, correo, puntuacion, telefono, id_nodo) values(?, ?, ?, ?, ?, ?);";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(
                textoSQL, [datos.nombreUsuario, datos.contrasenya, datos.correo, datos.puntuacion, datos.telefono, datos.idNodo],
                function (err) {
                    err ? rechazar(err) : resolver();
                }
            );
        });
    } // ()

    // ................................................................................................................................................
    //datos:{nombreUsuario:Texto, contrasenya=Texto}
    // -->
    // buscarUsuarioConId() <--
    // <--
    // {id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, puntuacion:Z, telefono=Texto, idNodo=Texto}
    // ................................................................................................................................................
    buscarUsuarioConNombreYContrasenya(datos) {
        var textoSQL =
            "select * from usuarios where nombre_usuario= ? and contrasenya= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(
                textoSQL,
        [datos.nombreUsuario, datos.contrasenya],
                (err, res) => {
                    err ? rechazar(err) : resolver(res);
                }
            );
        });
    }

    // ................................................................................................................................................
    //id:Z
    // -->
    // buscarUsuarioConId() <--
    // <--
    // {id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, puntuacion:Z, telefono=Texto, idNodo=Texto}
    // ................................................................................................................................................
    buscarUsuarioConId(id) {
        var textoSQL = "select * from usuarios where id= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [id], (err, res) => {
                err ? rechazar(err) : resolver(res);
            });
        });
    }

    // ................................................................................................................................................
    // datos:{id=Z, nombreUsuario:Texto, contrasenya=Texto, correo=Texto, puntuacion=Texto, telefono=Texto, idNodo=Texto}
    // -->
    // editarUsuario() -->
    // ................................................................................................................................................
    editarUsuario(datos) {
        var textoSQL =
            "update usuarios set nombre_usuario= ?, contrasenya= ?, correo= ?, puntuacion=?, telefono=?, id_nodo=? where id=  ?;";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.nombreUsuario, datos.contrasenya, datos.correo, datos.puntuacion, datos.telefono, datos.idNodo, datos.id],
                function (err) {
                    err ? rechazar(err) : resolver();
                }
            );
        });
    }

    // ................................................................................................................................................
    // datos:{idUsuario:Z, valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // -->
    // insertarMedicion() -->
    // ................................................................................................................................................
    async insertarMedicion(datos) {
        var textoSQL = "insert into mediciones values(?, ?, ?, ?);";
        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.valor, datos.momento, datos.ubicacion, datos.tipoMedicion],
                function (err) {
                    if (!err) {
                        resolver();
                    } else rechazar(err);
                }
            );
        }).then(() => {
            var textoSQL2 = "insert into medicionesdeusuarios values(?, ?, ?);";
            return new Promise((resolver, rechazar) => {
                this.laConexion.query(textoSQL2, [datos.idUsuario, datos.momento, datos.ubicacion],
                    function (err) {
                        err ? rechazar(err) : resolver();
                    }
                );
            });
        });
    } // ()

    // ................................................................................................................................................
    //datos:{momento:Datetime, ubicacion:Texto}
    // -->
    // buscarMedicionConMomentoYUbicacion() <--
    // <--
    // {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ................................................................................................................................................
    buscarMedicionConMomentoYUbicacion(datos) {
        var textoSQL = "select * from mediciones where momento= ? and ubicacion= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(
                textoSQL,
        [datos.momento, datos.ubicacion],
                (err, res) => {
                    err ? rechazar(err) : resolver(res);
                }
            );
        });
    }

    // ................................................................................................................................................
    //id:Z
    // -->
    // buscarMedicionesDeUsuario() <--
    // <--
    // Lista {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ................................................................................................................................................
    async buscarMedicionesDeUsuario(idUsuario) {
        var textoSQL =
            "select m.* from medicionesdeusuarios mu, mediciones m where m.ubicacion = mu.ubicacion_medicion AND mu.momento_medicion = m.momento AND mu.id_usuario = ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [idUsuario], (err, res) => {
                err ? rechazar(err) : resolver(res);
            });
        });
    }

    // ................................................................................................................................................
    // buscarMedicionConMomentoYUbicacion() <--
    // <--
    // Lista {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ................................................................................................................................................
    buscarTodasLasMediciones() {
        var textoSQL = "select * from mediciones";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, (err, res) => {
                err ? rechazar(err) : resolver(res);
            });
        });
    }

    // ................................................................................................................................................
    //id:Z
    // -->
    // buscarTipoMedidicionConID() <--
    // <--
    // {id:Z, descripcion:Texto, limite_max:R}
    // ................................................................................................................................................
    buscarTipoMedicionConID(id) {
        var textoSQL = "select * from tipomedida where id= ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [id], (err, res) => {
                err ? rechazar(err) : resolver(res);
            });
        });
    }

    // ................................................................................................................................................
    // buscarRecompensas() <--
    // <--
    // Lista {id:Texto, titulo:Texto, descripcion:Texto, coste:Z}
    // ................................................................................................................................................
    buscarRecompensas() {
        var textoSQL = "select * from recompensas";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, (err, res) => {
                err ? rechazar(err) : resolver(res);
            });
        });
    }

    // ................................................................................................................................................
    // cerrar() -->
    // ................................................................................................................................................
    cerrar() {
        return new Promise((resolver, rechazar) => {
            this.laConexion.end((err) => {
                err ? rechazar(err) : resolver();
            });
        });
    } // ()
}; // class
