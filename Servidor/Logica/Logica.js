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
        var textoSQL = "insert into usuarios (nombre_usuario, contrasenya, correo, puntuacion, telefono, id_nodo) values(?, ?, ?, ?, ?);";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(
                textoSQL, [datos.nombreUsuario, datos.contrasenya, datos.correo, datos.telefono, datos.idNodo],
                function (err) {
                    err ? rechazar(err) : resolver();
                }
            );
        });
    } // ()

    // ................................................................................................................................................
    // buscarUsuarios() <--
    // <--
    // {id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, puntuacion:Z, telefono=Texto, idNodo=Texto}
    // ................................................................................................................................................
    buscarUsuarios() {
        var textoSQL = "select * from usuarios";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL,
                (err, res) => {
                    err ? rechazar(err) : resolver(res);
                }
            );
        });
    }

    // ................................................................................................................................................
    //datos:{nombreUsuario:Texto, contrasenya=Texto}
    // -->
    // buscarUsuarioConNombreYContrasenya() <--
    // <--
    // {id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, puntuacion:Z, telefono=Texto, idNodo=Texto}
    // ................................................................................................................................................
    buscarUsuarioConNombreYContrasenya(datos) {
        var textoSQL = "select * from usuarios where nombre_usuario= ? and contrasenya= ?";
        
        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.nombreUsuario, datos.contrasenya],
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
    // buscarDistanciaYTiempoDeUsuarios() <--
    // <--
    // Lista {id:Z, nombreUsuario:Texto, correo:Texto, telefono=Texto, idNodo=Texto, distancia=R, tiempo= R}
    // ................................................................................................................................................
    async buscarDistanciaYTiempoDeUsuarios() {

        var res = []
        var distancia = 0 //En m
        var tiempo = 0 //En s

        //Obtengo los usuarios
        var usuarios = await this.buscarUsuarios()

        for (var i = 0; i < usuarios.length; i++) {

            //Obtengo las medidas de cada usuario
            var medidas = await this.buscarMedicionesDeUsuario(usuarios[i].id)

            for (var j = 1; j < medidas.length; j++) {

                //Le enviamos la latitud y longitud de las dos medidas ya separadas y convertidas a real y obtenemos la distancia que se la sumamos a la global
                var dist = this.obtenerDistancia(parseFloat(medidas[j - 1].ubicacion.split(",")[0]), parseFloat(medidas[j - 1].ubicacion.split(",")[1]), parseFloat(medidas[j].ubicacion.split(",")[0]), parseFloat(medidas[j].ubicacion.split(",")[1]))

                //Medida anterior del mismo dia
                var diaAnterior = new Date(medidas[j - 1].momento)
                var t = (dia.getTime() - diaAnterior.getTime()) / 1000
                
                if (t < 900 + 300 /*Tiempo que tarda en enviar el beacon + Error de enviado*/ && dist < 10000 /*Distancia para comprobar que no ha empezado a medir desde otro lugar lejano el mismo día*/ ) {

                    tiempo += t
                    distancia += dist
                }
            }

            var primerDia = new Date(medidas[0].momento)
            var ultimoDia = new Date();
            var nDias = (ultimoDia.getTime() - primerDia.getTime()) / 86400000

            res.push({
                id: usuarios[0].id,
                nombreUsuario: usuarios[0].nombre_usuario,
                correo: usuarios[0].correo,
                telefono: usuarios[0].telefono,
                idNodo: usuarios[0].id_nodo,
                distancia: distancia / nDias,
                tiempo: tiempo / nDias
            })

            //Reseteamos la distancia y el tiempo ya que cambiamos de usuario
            tiempo = 0
            distancia = 0
        }
        
        return res
    }

    // ................................................................................................................................................
    // <R>, <R>, <R>, <R>
    // -->
    // obtenerDistancia() <--
    // <--
    // <R>
    // ................................................................................................................................................
    //Empleamos la formula Haversvine
    obtenerDistancia(lat1, lon1, lat2, lon2) {

        var R = 6371000

        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // ................................................................................................................................................
    // datos:{id=Z, nombreUsuario:Texto, contrasenya=Texto, correo=Texto, puntuacion=Texto, telefono=Texto, idNodo=Texto}
    // -->
    // editarUsuario() -->
    // ................................................................................................................................................
    editarUsuario(datos) {
        var textoSQL = "update usuarios set nombre_usuario= ?, contrasenya= ?, correo= ?, puntuacion=?, telefono=?, id_nodo=?, puntos_canjeables=? where id=  ?;";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.nombreUsuario, datos.contrasenya, datos.correo, datos.puntuacion, datos.telefono, datos.idNodo, datos.puntosCanjeables, datos.id],
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
                    err ? rechazar(err) : resolver();
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
    //id:Z
    // -->
    // buscarCodigoRecompensaConId() <--
    // <--
    // {id_recompensa:Z, codigo:Texto}
    // ................................................................................................................................................
    buscarCodigoRecompensaConId(id) {
        var textoSQL = "select * from codigosrecompensas where id_recompensa= ? limit 1;"
        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, id, (err, res) => {
                err ? rechazar(err) : resolver(res);
            });
        }).then((result) => {

            var textoSQL2 = "delete from codigosrecompensas where codigo= ? limit 1;"
            return new Promise((resolver, rechazar) => {
                this.laConexion.query(textoSQL2, result[0].codigo,
                    function (err) {
                        err ? rechazar(err) : resolver(result);
                    }
                )
            })
        })
    }
    
    // ................................................................................................................................................
    //id:Z
    // -->
    // buscarMedicionesDeUsuario() <--
    // <--
    // Lista {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ................................................................................................................................................
    async buscarMedicionesDeUsuarioDeHoy(idUsuario) {
        var textoSQL =
            "select m.* from medicionesdeusuarios mu, mediciones m where m.ubicacion = mu.ubicacion_medicion AND mu.momento_medicion = m.momento AND mu.id_usuario = ? AND DATE(m.momento)=CURRENT_DATE";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [idUsuario], (err, res) => {
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
