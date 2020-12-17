// ................................................................................................................................................
// Logica.js
// ................................................................................................................................................

const mysql = require("mysql");
const Utilidades = require("./Utilidades.js");
var utilidades = new Utilidades();

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
        var textoSQL = "insert into usuarios (nombre_usuario, contrasenya, correo, telefono, id_nodo) values(?, ?, ?, ?, ?);";

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
    // buscarUsuariosOrdenadosPorPuntuación() <--
    // <--
    // {id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, puntuacion:Z, telefono=Texto, idNodo=Texto}
    // ................................................................................................................................................
    buscarUsuariosOrdenadosPorPuntuación() {
        var textoSQL = "select * from usuarios order by puntuacion desc";

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
    async buscarDistanciaYTiempoDeUsuarios(primerDia) {

        var res = []
        var distancia = 0 //En m
        var tiempo = 0 //En s

        var primerDia = new Date(primerDia)

        //Obtengo los usuarios
        var usuarios = await this.buscarUsuarios()

        for (var i = 0; i < usuarios.length; i++) {

            //Obtengo la distancia y el tiempo
            var objDistanciaTiempo = await this.buscarDistanciaYTiempoDeUsuario(usuarios[i].id, primerDia)

            var ultimoDia = new Date();

            //Nº de dias que han pasado desde que recibe el nodo hasta el día que le pasamos
            var nDias = Math.ceil((ultimoDia.getTime() - primerDia.getTime()) / 86400000)

            //Añadimos al usuario
            res.push({
                id: usuarios[i].id,
                nombreUsuario: usuarios[i].nombre_usuario,
                correo: usuarios[i].correo,
                telefono: usuarios[i].telefono,
                idNodo: usuarios[i].id_nodo,
                distancia: Math.round(objDistanciaTiempo.distancia / nDias),
                tiempo: Math.round(objDistanciaTiempo.tiempo / nDias)
            })
        }

        return res
    }

    // ................................................................................................................................................
    // id:Z -->
    // buscarDistanciaYTiempoDeUsuario() <--
    // <--
    // {distancia=R, tiempo= R, momento=DateTime}
    // ................................................................................................................................................
    async buscarDistanciaYTiempoDeUsuario(idUsuario, primerDia) {

        var res
        var distancia = 0 //En m
        var dist = 0;
        var tiempo = 0 //En s

        var medidas = await this.buscarMedicionesDeUsuario(idUsuario)

        for (var i = 1; i < medidas.length; i++) {

            var dia = new Date(medidas[i].momento)

            if (primerDia.getTime() < dia.getTime()) {

                //Le enviamos la latitud y longitud de las dos medidas ya separadas y convertidas a real y obtenemos la distancia que se la sumamos a la global
                dist = utilidades.obtenerDistancia(parseFloat(medidas[i - 1].ubicacion.split(",")[0]), parseFloat(medidas[i - 1].ubicacion.split(",")[1]), parseFloat(medidas[i].ubicacion.split(",")[0]), parseFloat(medidas[i].ubicacion.split(",")[1]))

                //Medida anterior
                var diaAnterior = new Date(medidas[i - 1].momento)

                var t = (dia.getTime() - diaAnterior.getTime()) / 1000

                if (t < 900 + 300 /*Tiempo que tarda en enviar el beacon + Error de enviado*/ && dist < 10000 /*Distancia para comprobar que no ha empezado a medir desde otro lugar lejano el mismo día*/ ) {

                    tiempo += t
                    distancia += dist
                }
            }
        }

        res = {
            tiempo: tiempo,
            distancia: distancia,
            ultimaDistancia: dist,
        }

        return res
    }


    obtenerLecturas(tipoLectura) {

        var fs = require('fs');

        return new Promise((resolver, rechazar) => {

            fs.readFile('../Datos/medicionesInterpoladas.json', 'utf8', function (err, data) {

                if (err) rechazar(err)

                var mediciones = JSON.parse(data)
                console.log(mediciones)
                var res;

                for (var i = 0; i < mediciones.length; i++) {

                    if (mediciones[i].TipoMedicion == tipoLectura) res = mediciones[i].mediciones
                }
                resolver(res);

            })

        })
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
    // datos:{puntuacion=Texto, id=Z}
    // -->
    // editarPuntuacionUsuario() -->
    // ................................................................................................................................................
    editarPuntuacionUsuario(datos) {
        var textoSQL = "update usuarios set puntuacion= puntuacion + ?, puntos_canjeables= puntos_canjeables + ? where id=  ?;";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [datos.puntuacion, datos.puntuacion, datos.id],
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
    buscarMedicionesDeUsuario(idUsuario) {
        var textoSQL = "select m.* from medicionesdeusuarios mu, mediciones m where m.ubicacion = mu.ubicacion_medicion AND mu.momento_medicion = m.momento AND mu.id_usuario = ?";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [idUsuario], (err, res) => {
                err ? rechazar(err) : resolver(res);
            });
        });
    }

    // ................................................................................................................................................
    //tipoMedicion: Texto
    // -->
    // buscarMedicionesDeTipoMedicion() <--
    // <--
    // Lista {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ................................................................................................................................................
    buscarMedicionesDeTipoMedicion(tipoMedicion) {

        var textoSQL = "select * from mediciones WHERE tipoMedicion= ? AND momento >= DATE_SUB(NOW(),INTERVAL 2 HOUR)";

        return new Promise((resolver, rechazar) => {
            this.laConexion.query(textoSQL, [tipoMedicion], (err, res) => {
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
    // id:Z 
    //-->
    // obtenerPuntuacion() <--
    // <--
    // Z
    // ................................................................................................................................................
    async obtenerPuntuacion(idUsuario) {

        var distyTiempo = await this.buscarDistanciaYTiempoDeUsuario(idUsuario, new Date(2000, 12, 10))
        return Math.ceil(distyTiempo.ultimaDistancia / 100)
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
    // parsearMediciones()
    // ................................................................................................................................................
    async parsearMediciones() {
        let tipoSensor=["GI", "CO2", "NO2", "O3", "SO2"];
        tipoSensor.forEach(async(val)=>{
            await utilidades.crearArchivo(val, utilidades.parsearMedicion(await this.buscarMedicionesDeTipoMedicion(val)))
        })
        /*var string = ""
        string += utilidades.parsearMedicion(await this.buscarMedicionesDeTipoMedicion("GI"));
        string += utilidades.parsearMedicion(await this.buscarMedicionesDeTipoMedicion("CO2"));
        string += utilidades.parsearMedicion(await this.buscarMedicionesDeTipoMedicion("NO2"));
        string += utilidades.parsearMedicion(await this.buscarMedicionesDeTipoMedicion("O3"));
        string += utilidades.parsearMedicion(await this.buscarMedicionesDeTipoMedicion("SO2"));*/

        const { exec } = require('child_process');
        exec('runMatlab.bat',{cwd:'../MatLab/'}, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
            
        }
        console.log(stdout);
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
