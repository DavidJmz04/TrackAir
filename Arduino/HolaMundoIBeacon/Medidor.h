// -*- mode: c++ -*-

#ifndef MEDIDOR_H_INCLUIDO
#define MEDIDOR_H_INCLUIDO

// ------------------------------------------------------
// ------------------------------------------------------
class Medidor {

    /*
      Private:
      sensorData: [Z]
      leer11Datos() (Consulta) (Modifica sensorData: [Z])
    */

    // .....................................................
    // .....................................................
  private:

    int sensorData [11];
    
    void leer11Datos(void)
    {
      String dataString;
      while (Serial1.available()) Serial1.read();
      Serial1.write('\r');
      while (!Serial1.available()) {
      }
      dataString = Serial1.readStringUntil('\n');
      for (int i = 0; i < 11; i++) {
        String subS = dataString.substring(0, dataString.indexOf(','));
        if (subS.length() != 0){
        sensorData[i] = subS.toInt();
        dataString = dataString.substring(dataString.indexOf(',') + 2);
        }
      }
      /*
      for (int i = 0; i < 11; i++) {
        //while (!Serial1.available()) { }
        while ( !Serial1 ) delay(10);
        sensorData[i] = Serial1.parseInt();
        //SN [XXXXXXXXXXXX], PPB [0 : 999999], TEMP [-99 : 99],
        //RH [0 :99], RawSensor[ADCCount], TempDigital, RHDigital,
        //Day [0 : 99], Hour [0 : 23], Minute [0 : 59], Second [0 : 59]
      }
      */
    }


  public:

    // .....................................................
    // constructor
    // .....................................................
    Medidor() { //Se le podria pasar como parametro los Baudios para el Serial1.Begin()
      //Para Serial1
    } // ()

    // .....................................................
    // .....................................................
    void iniciarMedidor(long baudios) {
      // las cosas que no se puedan hacer en el constructor, if any
      Serial1.begin(baudios);
    } // ()

    //......................................................
    //......................................................
    void configurarMedidor(char parameter){
      Serial1.write(parameter);
    } // ()

    // .....................................................
    // .....................................................
    int medirIrritante() {
      Serial1.print('\r'); // Inicia una lectura del sensor. Ahora hay que espera a que nos envíe algo de vuelta!
      leer11Datos();
      return sensorData[1];
    } // ()

    // .....................................................
    // .....................................................
    int medirTemperatura() {
      Serial1.print('\r'); // Inicia una lectura del sensor. Ahora hay que espera a que nos envíe algo de vuelta!
      leer11Datos();
      return sensorData[2]; //Sensor DATA 5 - RAW VALUE
    } // ()

    

}; // class

// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
#endif
