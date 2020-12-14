
// --------------------------------------------------------------
//
// Jordi Bataller i Mascarell
// 2019-07-07
//
// --------------------------------------------------------------

// https://learn.sparkfun.com/tutorials/nrf52840-development-with-arduino-and-circuitpython

// https://stackoverflow.com/questions/29246805/can-an-ibeacon-have-a-data-payload

// --------------------------------------------------------------
// --------------------------------------------------------------
#include <bluefruit.h>

#undef min // vaya tela, están definidos en bluefruit.h y  !
#undef max // colisionan con los de la biblioteca estándar

// --------------------------------------------------------------
// --------------------------------------------------------------
#include "LED.h"
#include "Pantallita.h"

// --------------------------------------------------------------
// --------------------------------------------------------------
namespace Globales {
  
  LED elLED ( /* NUMERO DEL PIN LED = */ 7 );

  Pantallita elPuerto ( /* velocidad = */ 115200 ); // 115200 o 9600 o ...

  // Serial1 en el ejemplo de Curro creo que es la conexión placa-sensor 
};

// --------------------------------------------------------------
// --------------------------------------------------------------
#include "EmisoraBLE.h"
#include "Publicador.h"
#include "Medidor.h"

// ..............................................................
// ..............................................................
int intervalo = 1000; //10000;
float NO2MASS = 46.0055;
float SO2MASS = 64.066;
float O3MASS = 48;

// --------------------------------------------------------------
// --------------------------------------------------------------
namespace Globales {

  Publicador elPublicador;

  Medidor elMedidor;

}; // namespace

// --------------------------------------------------------------
// --------------------------------------------------------------
void inicializarPlaquita () { } // ()

// --------------------------------------------------------------
// setup()
// --------------------------------------------------------------
void setup() {

  //Globales::elPuerto.esperarDisponible();

  // 
  // 
  // 
  inicializarPlaquita();

  // Suspend Loop() to save power
  // suspendLoop();

  // 
  // 
  // 
  Globales::elPublicador.encenderEmisora();

  // Globales::elPublicador.laEmisora.pruebaEmision();
  
  // 
  // 
  // 
  Globales::elMedidor.iniciarMedidor(9600);

  // 
  // 
  // 
  
  Globales::elPuerto.escribir( "---- Calibrando medidor ---- \n " );
  Globales::elMedidor.medirIrritante();
  esperar( 10000 );
  Globales::elMedidor.configurarMedidor('Z'); // Calibramos a 0 el sensor despues de unas tomas.
  

  Globales::elPuerto.escribir( "---- setup(): fin ---- \n " );

} // setup ()


// --------------------------------------------------------------
// loop ()
// --------------------------------------------------------------
namespace Loop {
  uint8_t cont = 0;
};


// ..............................................................
// ..............................................................
void loop () {

  using namespace Loop;
  using namespace Globales;

  cont++;

  elPuerto.escribir( "\n---- loop(): empieza " );
  elPuerto.escribir( cont );
  elPuerto.escribir( "\n" );


  //lucecitas();

  // 
  // mido y publico
  // 
  int valorIrritante = elMedidor.medirIrritante();

  elPuerto.escribir( "Valor irritante (PPB): " );
  elPuerto.escribir( valorIrritante );
  elPuerto.escribir( "\n" );

  int temperatura = elMedidor.medirTemperatura();

  elPuerto.escribir( "Temperatura: " );
  elPuerto.escribir( temperatura );
  elPuerto.escribir( "\n" );

  //µg/m3 = (ppb)*(12.187)*(M) / (273.15 + °C)
  float ugm3 = ((valorIrritante<0?0:valorIrritante))*(12.187)*(NO2MASS) / (273.15 + temperatura);
  
  elPuerto.escribir( "Conversión ug/m3: " );
  elPuerto.escribir( ugm3 );
  elPuerto.escribir( "\n" );

  // 
  // mido y publico
  // 
  elPublicador.publicarIrritanteConvertido( ugm3,
							cont,
							intervalo // intervalo de emisión
							);

  // 
  // prueba para emitir un iBeacon y poner
  // en la carga (21 bytes = uuid 16 major 2 minor 2 txPower 1 )
  // lo que queramos (sin seguir dicho formato)
  // 
  // Al terminar la prueba hay que hacer Publicador::laEmisora privado
  // 

  esperar( 1000 );

  elPublicador.laEmisora.detenerAnuncio();
  
  // 
  // 
  // 
  elPuerto.escribir( "---- loop(): acaba **** " );
  elPuerto.escribir( cont );
  elPuerto.escribir( "\n" );
  
} // loop ()
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
