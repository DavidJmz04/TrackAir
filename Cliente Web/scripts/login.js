//Elementos HTML
let btnSubmit = document.querySelector("#btnSubmit");
let form = document.querySelector("form");
let inputUsuario = document.querySelector("#inputUsuario");
let inputContrasenya = document.querySelector("#inputContrasenya");
let msgError = document.querySelector(".msg-error");

const laLogica = new Logica();

function chequearCookies() {
    let id = laLogica.getCookie("id");
    console.log("id" + id)
    let logout = false;
    if (id == "1") {
        window.location.href = "./admin.html";
    } else if (id != "") {
        window.location.href = "./perfil.html";
    } else {
        document.getElementById("login").style.display = "block";
    }
    if (id == "1") window.location.href = "./admin.html";
}

//Añadimos el comportamiento al formulario cuando se envíe
form.addEventListener("submit", (e) => {
    //Prevenimos que se envíe ya que no hay path
    e.preventDefault();

    const correo = inputUsuario.value;
    const contrasenya = inputContrasenya.value;

    let promesa = laLogica.post("login", {
        nombreUsuario: correo,
        contrasenya: CryptoJS.SHA256(contrasenya).toString()
    }).then((res) => {

        //Si está logueado creamos una cookie que expira en 1 día
        if (res.existe && res.id) {
            chequearCookies();
            document.cookie = `id=${res.id}`;
            document.cookie = `name=${correo}`
            
            //Dentro de un día
            let date = new Date(Date.now() + 86400e3);
            date = date.toUTCString();
            document.cookie = `id=${res.id}; expires=${date};path=/`;
            inputContrasenya.value = "";
            inputUsuario.value = "";
            chequearCookies();
            document.getElementById("login").style.display = "none";
        } else {
            msgError.style.display = "inline";
            inputContrasenya.value = "";
            laLogica.logout();
        }
        console.log(document.cookie);
    });
});
