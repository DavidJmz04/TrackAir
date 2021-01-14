//Elementos HTML
let btnSubmit = document.querySelector("#btnSubmit");
let form = document.querySelector("form");
let inputUsuario = document.querySelector("#inputUsuario");
let inputContrasenya = document.querySelector("#inputContrasenya");
let msgError = document.querySelector(".msg-error");
let botonCerrar = document.querySelector(".cerrar-modal");

botonCerrar.addEventListener("click", () => {
    modal.style.display = "none";
});

inputContrasenya.addEventListener("focus", () => {
    msgError.style.display = "none";
});
inputUsuario.addEventListener("focus", () => {
    msgError.style.display = "none";
});

const laLogica = new Logica();

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
            document.cookie = `id=${res.id}`;
            document.cookie = `name=${correo}`
            
            //Dentro de un día
            let date = new Date(Date.now() + 86400e3);
            date = date.toUTCString();
            document.cookie = `id=${res.id}; expires=${date};path=/`;
            inputContrasenya.value = "";
            inputUsuario.value = "";
            modal.style.display = "none";

        } else {
            msgError.style.display = "inline";
            inputContrasenya.value = "";
            laLogica.logout();
        }
        console.log(document.cookie);
    });
});
