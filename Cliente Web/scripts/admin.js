const laLogica = new Logica()
var expanded = false

//Cuando se carga la página
window.onload = function () {
    buscarUsuarios();
    obtenerPDFUso();
};

function obtenerPDFUso() {

    var slc = document.getElementById("select-uso");
    slc.addEventListener("change", () => {

        var dia = new Date();
        var res;

        switch (slc.value) {

            case "dia":
                res = new Date(dia.getTime() - 1000 * 60 * 60 * 24);
                break;
            case "semana":
                res = new Date(dia.getTime() - 1000 * 60 * 60 * 24 * 7);
                break;
            case "mes":
                res = new Date(dia.getTime() - 1000 * 60 * 60 * 24 * 30);
                break;
        }

        laLogica.get("informe/uso/" + res);
    })
}

function buscarUsuarios() {

    var usuarios = laLogica.get("usuarios").then((usuarios) => {
        var contenedor = document.getElementById("contenedor")

        //Llenamos el contenedor con la información que nos interesa 
        for (var i = 0; i < usuarios.length; i++)
            contenedor.innerHTML += '<button class="item" data-value="' + usuarios[i].nombre + '" data-nombre="' + usuarios[i].nombre_usuario + '">' + usuarios[i].nombre + '(@' + usuarios[i].nombre_usuario + ')</button><div class="caja-parrafo"><form action="" autocomplete="off" class="row" id="' + usuarios[i].id + '"><div class="col-4"><p class="texto-parrafo">Nombre: </p><input type="text" value="' + usuarios[i].nombre + '" required><p class="texto-parrafo">Telefono: </p><input type="text" value="' + usuarios[i].telefono + '" required><p class="texto-parrafo">Puntuacion: </p><input type="text" value="' + usuarios[i].puntuacion + '" required></div><div class="col-4"><p class="texto-parrafo">Nombre Usuario: </p><input type="text" value="' + usuarios[i].nombre_usuario + '" required><p class="texto-parrafo">Correo: </p><input type="text" value="' + usuarios[i].correo + '" required><p class="texto-parrafo">Puntos canjeables: </p><input type="text" value="' + usuarios[i].puntos_canjeables + '" required></div><div class="col-4"><p class="texto-parrafo">Contraseña: </p><input type="text" value="' + usuarios[i].contrasenya + '" disabled><p class="texto-parrafo">ID Nodo: </p><input type="text" value="' + usuarios[i].id_nodo + '" disabled></div><div><button type="submit" onclick="editarUsuario(' + usuarios[i].id + ')">Guardar</button><button type="button" onclick="borrarUsuario(' + usuarios[i].id + ')">Borrar</button></form></div>'
            
        acordeon()
    })
}


function acordeon() {

    var acc = document.getElementsByClassName("item");

    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) panel.style.maxHeight = null;
            else panel.style.maxHeight = panel.scrollHeight + "px";
        });
    }
}

function crearUsuario() {

    laLogica.post("usuario", {
        nombreUsuario: document.getElementById("NombreUsuario").value,
        nombre: document.getElementById("Nombre").value,
        contrasenya: CryptoJS.SHA256(document.getElementById("Contrasenya").value).toString(),
        correo: document.getElementById("Correo").value,
        telefono: document.getElementById("Telefono").value
    })
}

function editarUsuario(id) {

    laLogica.put("editarUsuario", {
        id: id,
        nombreUsuario: document.getElementById(id).getElementsByTagName("input")[3].value,
        nombre: document.getElementById(id).getElementsByTagName("input")[0].value,
        contrasenya: document.getElementById(id).getElementsByTagName("input")[6].value,
        correo: document.getElementById(id).getElementsByTagName("input")[4].value,
        puntuacion: document.getElementById(id).getElementsByTagName("input")[2].value,
        telefono: document.getElementById(id).getElementsByTagName("input")[1].value,
        puntosCanjeables: document.getElementById(id).getElementsByTagName("input")[5].value
    })
}

function borrarUsuario(id) {


    if (confirm('¿Quieres borrar definitivamente el usuario?')) {
        laLogica.delete("borrarUsuario", {
            id: id
        })
        location.reload();
    }
}

//Muestra o esconde a los usuarios dependiendo de lo que pone en el input del buscador
function buscar() {

    //Valor escrito
    var valor = document.getElementById("buscar").value

    //Lista de usuarios
    var selector = document.getElementsByClassName("item")
    
    var res = []

    //Llenamos una lista de booleanos que representan los usuarios (Si es ese usuario se pone a true)
    for (var i = 0; i < selector.length; i++) res.push(false)

    for (var i = 0; i < selector.length; i++) {

        var lCoincidenNUsuario = buscarLetrasQueCoinciden(valor, selector[i].getAttribute('data-nombre'))
        var lCoincidenNombre = buscarLetrasQueCoinciden(valor, selector[i].getAttribute('data-value'))

        if (lCoincidenNUsuario == valor.length || lCoincidenNombre == valor.length) res[i] = true
    }


    for (var i = 0; i < selector.length; i++) {

        if (res[i]) selector[i].style.display = "block"
        else selector[i].style.display = "none"
    }
}

// <Texto>, <Texto> --> buscarLetrasQueCoinciden() --> <Z>

//Busca las letras que coinciden entre dos palabras
function buscarLetrasQueCoinciden(valor, palabra) {

    var letrasCoinciden = 0

    for (var j = 0; j < valor.length; j++) {

        if (palabra[j] != undefined) {

            if (valor[j].toUpperCase() == palabra[j].toUpperCase()) letrasCoinciden++
        }
    }
    
    if (valor.length <= letrasCoinciden) letrasCoinciden = valor.length 
    else letrasCoinciden = 0

    return letrasCoinciden
}
