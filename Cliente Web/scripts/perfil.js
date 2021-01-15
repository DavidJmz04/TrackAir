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
    
    crearGrafica("Calidad Aire")
    
    /*
  let id = laLogica.getCookie("id");
  if (id != "") {
    let info = laLogica.get("usuario/" + id).then((inf) => {
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
  */
});

async function crearGrafica(titulo) {
    
    idUsuario= 1
    var calidad = await laLogica.get("calidadAire/" + idUsuario)

    console.log(calidad)
    // create data
    var data = [
      ["January", 10000],
      ["February", 12000],
      ["March", 18000],
      ["April", 11000],
      ["May", 9000]
    ];

    // create a chart
    var chart = anychart.line();

    // create a line series and set the data
    var series = chart.line(data);
    
    // set the chart title
    chart.title(titulo);

    // set the titles of the axes
    var xAxis = chart.xAxis();
    xAxis.title("Hora");
    var yAxis = chart.yAxis();
    yAxis.title("Valor");

    // set the container id
    chart.container("myChart");
    
    chart.xScale().mode('continuous');

    // initiate drawing the chart
    chart.draw();

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