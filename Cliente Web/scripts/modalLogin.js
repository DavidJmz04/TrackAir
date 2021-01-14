let botonUsuario = document.querySelector(".icono-usuario");
let modal = document.querySelector(".modal");

// Si le da click al botón de usuario, se abre el popup
botonUsuario.addEventListener("click", (e) => {
  let id = laLogica.getCookie("id");
    console.log("id" + id)
  let logout = false;
  if (id != "") {
    window.location.href = "./perfil.html";
    /*
    let info = laLogica.recuperarDatosUsuarioConId(id).then((e) => {
      //console.log("aaa");
      //console.log(e);
      
      logout = confirm(
        `Bienvenido, ${e.nombre_usuario}. \n Tu puntuación: ${e.puntuacion} \n Tu correo: ${e.correo} \n Quiere cerrar sesión?`
      );
      if (logout) laLogica.logout();
      
    });
    */

    //console.log(info.then());
    //logout = true;
  } else {
    modal.style.display = "block";
  }
});

// Si le da click a cualquier cosa que no sea el modal, este se cierra
window.addEventListener("click", (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});
