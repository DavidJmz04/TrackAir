let nombre = document.querySelector(".nombre-completo");
let nombreUsuario = document.querySelector(".nombre-usuario");
let reputacion = document.querySelector(".reputacion");
let correo = document.querySelector(".correo");
let telefono = document.querySelector(".telefono");
let cerrarSesion = document.querySelector(".item-cerrar");
let ranking = document.querySelector(".item-ranking");

const laLogica = new Logica();
let user;
window.addEventListener("load", () => {
  let id = getCookie("id");
  if (id != "") {
    let info = laLogica.recuperarDatosUsuarioConId(id).then((inf) => {
      //console.log(inf);
      inf=inf[0];
      nombre.textContent=inf.nombre;
      nombreUsuario.textContent = `@${inf.nombre_usuario}`;
      reputacion.textContent = `Reputación:${inf.puntuacion}`;
      correo.textContent = inf.correo;
      let tlf = inf.telefono;
      let t = tlf.match(/.{1,3}/g);
      telefono.textContent = "+34";
      t.forEach((element) => {
        telefono.textContent += " " + element;
      });
    });
  } else {
    alert(
      "Tienes que tener una sesión iniciada para ver los datos de tu perfil."
    );
    window.location.href = "./../";
  }
});

// texto -> getCookie() -> texto
function getCookie(cname) {
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

cerrarSesion.addEventListener("click", () => {
  logout = confirm(`¿Está seguro de querer cerrar sesión?`);
  if (logout) {
    laLogica.logout(), (window.location.href = "./../");
  }
});

ranking.addEventListener("click", ()=>{
  laLogica.obtenerPDF();
})