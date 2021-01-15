let nombre = document.querySelector(".nombre-completo");
let nombreUsuario = document.querySelector(".nombre-usuario");
let reputacion = document.querySelector(".reputacion");
let correo = document.querySelector(".correo");
let telefono = document.querySelector(".telefono");
let cerrarSesion = document.querySelector(".item-cerrar");
let ranking = document.querySelector(".item-ranking");
let id;

const laLogica = new Logica();
let user;
window.addEventListener("load", () => {

  acordeon()
  crearGrafica("Calidad Aire")

  id = laLogica.getCookie("id");
  if (id != "") {
    let info = laLogica.get("usuario/" + id).then((inf) => {
      //console.log(inf);
      inf = inf[0];
      nombre.textContent = inf.nombre;
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

  var calidad = await laLogica.recuperarCalidadAire(laLogica.getCookie("id"))
  
  document.getElementById("grafica").innerText += " " + calidad[0].calidadMedia
  console.log(calidad)
  var calidad = calidad[0]

  var data = []
  // create data
  for (var i = 0; i < calidad.mediciones.length; i++) data.push({ x: calidad.mediciones[i].momento + "",name:calidad.mediciones[i].calidad, value: calidad.mediciones[i].valor })

  // create a chart
  chart = anychart.line();

  // create a line series and set the data
  var series = chart.line(data);
  (chart.getSeries(0).labels().enabled(true)).format("{%name}");
  chart.getSeries(0).labels().fontColor("black");
  
  series.tooltip()
  .position('right')
  .anchor('left-center')
  .offsetX(5)
  .offsetY(5)
  .format("{%Name}{groupsSeparator: } ({%Value})");


  chart.tooltip().positionMode('point');
  chart.animation(true);

  // set the container id
  chart.container("myChart");

  // initiate drawing the chart
  chart.draw();
  /*
  for (var i = 0; i < calidad.mediciones.length; i++) data.push({x:calidad.mediciones[i].momento + "", value: calidad.mediciones[i].valor})

  console.log(data)
  // create a chart
  var chart = anychart.line();

  // create a line series and set the data
  var firstSeries = chart.line(data);// create first series with mapped data
  firstSeries.name('Brandy');
  firstSeries.hovered().markers().enabled(true).type('circle').size(4);
  firstSeries
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

      // turn on chart animation
      chart.animation(true);

      // set chart padding
      chart.padding([10, 20, 5, 20]);

      // turn on the crosshair
      chart.crosshair().enabled(true).yLabel(false).yStroke(null);

      // set tooltip mode to point
      chart.tooltip().positionMode('point');
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

      */
}

cerrarSesion.addEventListener("click", () => {
  logout = confirm(`¿Está seguro de querer cerrar sesión?`);
  if (logout) {
    laLogica.logout(), (window.location.href = "./../");
  }
});

ranking.addEventListener("click", () => {
  laLogica.obtenerPDF();
})