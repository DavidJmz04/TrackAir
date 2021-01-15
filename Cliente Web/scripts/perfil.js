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
    
    acordeon()
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

function acordeon() {

    var acc = document.getElementsByClassName("calidad");
    
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) panel.style.maxHeight = null;
            else panel.style.maxHeight = panel.scrollHeight + "px";
        });
    }
}

async function crearGrafica(titulo) {
    
    idUsuario= 1
    var calidad = await laLogica.get("calidadAire/" + idUsuario)
    var calidad= calidad[0]
    
    var data= []
    
    for(var i=0; i< calidad.mediciones.length; i++)data.push([calidad.mediciones[i].momento, calidad.mediciones[i].valor])
    
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
    yAxis.

    // set the container id
    chart.container("myChart");
    
    chart.xScale().mode('continuous');

    // initiate drawing the chart
    chart.draw();
    
    
    
       column.tooltip()
                .titleFormat("{%X}")
                .position(Position.CENTER_BOTTOM)
                .anchor(Anchor.CENTER_BOTTOM)
                .offsetX(0d)
                .offsetY(5d)
                .fontColor("white")
                .format("{%Name}{groupsSeparator: } ({%Value})");

        column.color("#1ddba6");

        cartesian.animation(true);
        cartesian.background().fill("#1DDBA6");

        cartesian.yScale().minimum(0d);
        RangeColors palette = RangeColors.instantiate();
        String[] colors = {"#f1ffe8", "#e8fcff", "#ffe8e8"};
        palette.items(colors, "#00ff00");
        palette.count(3);
        cartesian.yGrid(0).palette(palette);

        // set series labels text template
        (cartesian.getSeries(0).labels().enabled(true)).format("{%Name}");
        cartesian.getSeries(0).labels().fontColor("white");

        cartesian.tooltip().positionMode(TooltipPositionMode.POINT);
        cartesian.interactivity().hoverMode(HoverMode.BY_X);

        cartesian.xAxis(0).title().fontColor("white");
        cartesian.yAxis(0).title().fontColor("white");

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