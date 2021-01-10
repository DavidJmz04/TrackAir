const laLogica = new Logica()
var expanded = false


//Cuando se carga la página
window.onload = function () {
    buscarUsuarios();
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

        laLogica.obtenerPDFUso(res);
    })
}

function buscarUsuarios() {

    var usuarios = laLogica.get("usuarios").then((usuarios) => {
        var contenedor = document.getElementById("contenedor")

        //Llenamos el contenedor con la información que nos interesa 
        for (var i = 0; i < usuarios.length; i++) {
            contenedor.innerHTML += '<button class="item" data-value="' + usuarios[i].nombre + '">' + usuarios[i].nombre + '(@' + usuarios[i].nombre_usuario + ')</button><div class="caja-parrafo row"><div class="col-4"><p class="texto-parrafo">Nombre: </p><input type="text" value="' + usuarios[i].nombre + '"><p class="texto-parrafo">Telefono: </p><input type="text" value="' + usuarios[i].telefono + '"><p class="texto-parrafo">Puntuacion: </p><input type="text" value="' + usuarios[i].puntuacion + '"></div><div class="col-4"><p class="texto-parrafo">Nombre Usuario: </p><input type="text" value="' + usuarios[i].nombre_usuario + '"><p class="texto-parrafo">Correo: </p><input type="text" value="' + usuarios[i].correo + '"><p class="texto-parrafo">Puntos canjeables: </p><input type="text" value="' + usuarios[i].puntos_canjeables + '"></div><div class="col-4"><p class="texto-parrafo">Contraseña: </p><input type="text" value="' + usuarios[i].contrasenya + '"><p class="texto-parrafo">ID Nodo: </p><input type="text" value="' + usuarios[i].id_nodo + '" disabled></div><div><button onclick="editarUsuario(' + usuarios[i].id + ')">Guardar</button><button onclick="borrarUsuario(' + usuarios[i].id + ')">Borrar</button></div>'
        }
        
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


/*
function crearUsuario(){       
    
    laLogica.post("usuario", {
        nombreUsuario:,
        nombre:,
        contrasenya:,
        correo:,
        telefono:,
    })
}

function editarUsuario(id){
    
    laLogica.put("editarUsuario", {
        id: id,
        nombreUsuario:,
        nombre:,
        contrasenya:,
        correo:,
        puntuacion:,
        telefono:,
        puntosCanjeables:
    })
}

function borrarUsuario(id){
    
    if(confirm('¿Quieres borrar definitivamente el usuario?'))laLogica.delete("borrarUsuario", {id: id})
}


function buscar() {

    var valor = document.getElementById("buscar").value
    var selector = document.getElementById("selector")
    var elementos = document.getElementsByClassName("elementos")
    var checklist = document.getElementsByTagName("input")

    var res = []

    for (var i = 0; i < selector.children.length; i++) {

        res.push(false)
    }
    
    for (var i = 1; i < checklist.length; i++) {

        if (checklist[i].checked) {

            for (var j = 0; j < selector.children.length; j++) {

                var buscado = 0

                for (var k = 6 * j; k < 6 + 6 * j; k++) {

                    var filtro = elementos[k].getAttribute('data-filtro')

                    if (filtro == checklist[i].id) {

                        var palabra = elementos[k].getAttribute('data-value')

                        for (var l = 0; l < valor.length; l++) {

                            if (palabra[l] != undefined) {

                                if (valor[l].toUpperCase() == palabra[l].toUpperCase()) {

                                    buscado++
                                }
                            }
                        }

                        if (valor.length <= buscado) {

                            buscado = valor.length

                        } else {

                            buscado = 0
                        }
                    }

                    if (buscado == valor.length) {

                        res[j] = true
                    }
                }
            }
        }
    }

    for (var i = 0; i < selector.children.length; i++) {

        if (res[i]) {

            selector.children[i].style.display = "block"
            
        } else {

            selector.children[i].style.display = "none"
        }
    }
}
*/
