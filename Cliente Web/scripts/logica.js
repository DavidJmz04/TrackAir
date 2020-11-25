// -------------------------------------
// ------ Autor: Ignasi Marí Giner
// ------ 21-10-2020
// -------------------------------------

const servidor = "http://localhost";
const puerto = 8080;
class Logica {
  constructor() {}

  contadorTest = 0;
  //Llama al servidor para recuperar las mediciones de la base de datos
  // Devuelve un objeto con los datos.
  // recuperarMediciones() : {valor, ubicacion, momento}
  async recuperarMediciones() {
    let recurso = "mediciones";
    let res = await axios.get(`${servidor}:${puerto}/${recurso}`);

    let data = res.data;
    console.log(data);
    return data;
  }

  //Postea mediciones fake con un contador para comprobar que funciona el servidor
  //Devuelve un objeto con {guardado:true} o {guardado:false}
  async testPOST() {
    let recurso = "mediciones";

    this.contadorTest++;
    let res = await axios.post(`${servidor}:${puerto}/${recurso}`, {
      valor: this.contadorTest,
      ubicacion: { lat: 11.44231, lng: 98.92999 },
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
      let res = await axios.post(`${servidor}:${puerto}/${recurso}`, {
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
    let res = await axios.get(`${servidor}:${puerto}/${recurso}/${id}`);

    let data = res.data;
    //console.log(data);
    return data;
  }

  //TEST PARA PDF
  async obtenerPDF(){
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

       //window.open(`${servidor}:3000/${recurso}`);
  }
  //Destruye la cookie que se había creado para el inicio de sesión
  logout() {
    document.cookie = "id= ; expires= Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
