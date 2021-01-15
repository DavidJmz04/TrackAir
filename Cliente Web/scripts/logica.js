//const servidor = "https://igmagi.upv.edu.es";
const servidor = "http://localhost";
const puerto = ":8080";
class Logica {

    constructor() {}

    contadorTest = 0;

    async get(recurso) {

        let res = await axios.get(`${servidor}${puerto}/${recurso}`);

        let data = res.data;
        return data;
    }

    async post(recurso, datos) {

        let res = await axios.post(`${servidor}${puerto}/${recurso}`, datos);
        let data = res.data;
        return data;
    }

    async put(recurso, datos) {

        let res = await axios.put(`${servidor}${puerto}/${recurso}`, datos);
        let data = res.data;
        return data;
    }

    async delete(recurso, datos) {
        
        console.log(datos)

        let res = await axios.delete(`${servidor}${puerto}/${recurso}`, {data: datos});
        let data = res.data;
        return data;
    }

    // texto -> getCookie() -> texto
    getCookie( cname) {
        var name = cname + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    //Destruye la cookie que se había creado para el inicio de sesión
    logout() {
        document.cookie = "id= ; expires= Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "name= ; expires= Thu, 01 Jan 1970 00:00:00 GMT";
    }

    async recuperarCalidadAire(idUsuario) {
        let recurso = "calidadAire/" + idUsuario;
        let res = await axios.get(`${servidor}${puerto}/${recurso}`);

        let data = res.data;
        console.log(data);
        return data;
    }


    async recuperarMedicionesTiempoReal() {
        let recurso = "medicionesOficiales";
        let res = await axios.get(`${servidor}${puerto}/${recurso}`);

        let data = res.data;
        console.log(data);
        return data;
    }  setTipoGasSeleccionado(tipogas){
        this.tipoGasSeleccionado = tipogas;
    }

    setDiaSeleccionado(dia){
        this.diaSeleccionado = dia;
    }

    setHoraSeleccionada(hora){
        this.horaSeleccionada = hora;
    }


    getTipoGasSeleccionado(){
        return this.tipoGasSeleccionado;
    }

    getDiaSeleccionado(){
        return this.diaSeleccionado;
    }

    getHoraSeleccionada(){
        return this.horaSeleccionada;
    }
    async insertarMedicionesPlaceholder() {
        let recurso = "medicionesOficialesCSV";
        let res = await axios.get(`${servidor}${puerto}/${recurso}`);

        let data = res.data;
        console.log(data);
        return data;
    }

    //Llama al servidor para recuperar las mediciones de la base de datos
    // Devuelve un objeto con los datos.
    // recuperarMediciones() : {valor, ubicacion, momento}
    async recuperarMediciones() {
        let recurso = "mediciones";
        let res = await axios.get(`${servidor}${puerto}/${recurso}`);

        let data = res.data;
        console.log(data);
        return data;
    }

    async obtenerLecturas(tipoLectura) {
        let recurso = "lecturas/" + tipoLectura;
        let res = await axios.get(`${servidor}${puerto}/${recurso}`);

        let data = res.data;
        console.log(data);
        return data;
    }

    async recuperarCalidadAire(id) {
        let recurso = "calidadAire/" + id
        let res = await axios.get(`${servidor}${puerto}/${recurso}`);

        let data = res.data;
        console.log(data);
        return data;
    }

    //Postea mediciones fake con un contador para comprobar que funciona el servidor
    //Devuelve un objeto con {guardado:true} o {guardado:false}
    async testPOST() {
        let recurso = "mediciones";

        this.contadorTest++;
        let res = await axios.post(`${servidor}${puerto}/${recurso}`, {
            valor: this.contadorTest,
            ubicacion: {
                lat: 11.44231,
                lng: 98.92999
            },
            momento: Date.now().toString(),
        });

        let data = res.data;
        console.log(data);
        return data;
    }

    //Envia un POST para saber si el usuario está en la base de datos
    // {email: Texto, contrasenya: Texto} -> login() -> {existe: VoF, id:Z}
    async login(usuario, contrasenya) {
        //console.log("LOGIN pass: " + CryptoJS.SHA256(contrasenya).toString());
        let recurso = "login";
        try {
            let res = await axios.post(`${servidor}${puerto}/${recurso}`, {
                nombreUsuario: usuario,
                contrasenya: CryptoJS.SHA256(contrasenya).toString(),
            });

            let data = res.data;
            //console.log("data:");
            //console.log(data);
            //console.log(res.status);
            return data;
            if (res.status != 200) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    //Hace una petición GET para recuperar los datos del usuario mediante su id
    // id:Z -> recuperarDatosUsuarioConId() -> {nombre_usuario:texto, contrasenya:texto, correo:texto, puntuacion:Z, id:Z}
    async recuperarDatosUsuarioConId(id) {
        let recurso = "usuario";
        let res = await axios.get(`${servidor}${puerto}/${recurso}/${id}`);

        let data = res.data;
        //console.log(data);
        return data;
    }

    //TEST PARA PDF
    async obtenerPDFRanking() {
        let recurso = "informe/ranking";
        /*
        let res = await axios.get(`${servidor}:3000/${recurso}`, {
                method: 'GET',
                
            })
            .then(response => { 
                 //response.data.pipe(fs.createWriteStream("data.pdf"));
            })
            .catch(error => {
                console.log(error)
            });
            */

        window.location.href = `${servidor}${puerto}/${recurso}`;
        //window.open(`${servidor}${puerto}/${recurso}`);
    }
    async obtenerPDFUso(fecha) {
        let recurso = "informe/uso/" + fecha;
        /*
        let res = await axios.get(`${servidor}:3000/${recurso}`, {
                method: 'GET',
                
            })
            .then(response => { 
                 //response.data.pipe(fs.createWriteStream("data.pdf"));
            })
            .catch(error => {
                console.log(error)
            });
            */

        window.location.href = `${servidor}${puerto}/${recurso}`;
        //window.open(`${servidor}${puerto}/${recurso}`);
    }

    async obtenerPDFNodos() {
        let recurso = "informe/nodos";
        /*
        let res = await axios.get(`${servidor}:3000/${recurso}`, {
                method: 'GET',
                
            })
            .then(response => { 
                 //response.data.pipe(fs.createWriteStream("data.pdf"));
            })
            .catch(error => {
                console.log(error)
            });
            */

        window.location.href = `${servidor}${puerto}/${recurso}`;
        //window.open(`${servidor}${puerto}/${recurso}`);
    }

}
