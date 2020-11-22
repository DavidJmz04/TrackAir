package com.example.serpumar.sprint0_3a;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.location.Location;
import android.util.Log;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.serpumar.sprint0_3a.ClasesPojo.Medicion;
import com.example.serpumar.sprint0_3a.ClasesPojo.Ubicacion;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

public class ReceptorBluetooth {

    LogicaFake lf;

    private BluetoothAdapter.LeScanCallback callbackLeScan = null;

    private ScanCallback scanCallback = null; // for api >= 21

    private String ETIQUETA_LOG = ">>>>";

    private int contador = 0;

    private GPS gps = new GPS();

    private Context context;

    public void setContext(Context context) {
        this.context = context;
        lf= new LogicaFake(context);
    }

    private Medicion ultimaMedicion = null;
    private boolean isRunning = false;

    public Medicion getUltimaMedicion() {
        return ultimaMedicion;
    }

    //Beacon --> haLlegadoUnBeacon()
    public void haLlegadoUnBeacon(TramaIBeacon tib) {

        Log.d("Contador", "Trama Contador: " + tib.getContador() + " / Contador Guardado: " + contador);

        if (comprobarBeaconRepetido(tib)) {
            int medicion = Utilidades.bytesToInt(tib.getMinor());
            Ubicacion ub = gps.obtenerUbicacion(context);
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String date = dateFormat.format(Calendar.getInstance().getTime().getTime());

            ultimaMedicion = new Medicion(medicion, ub, date, "CO2");

            EditText cajaLectura = (EditText) ((Activity) context).findViewById(R.id.cajaSensor);
            cajaLectura.setText(getUltimaMedicion().getMedicion() + " ug/m3 - " + getUltimaMedicion().getDate() + " - " + getUltimaMedicion().getUbicacion().getLatitud() + ", " + getUltimaMedicion().getUbicacion().getLongitud());
            //lf.guardarMedicion(medicion, ub, date, context); //Le paso como variable el contexto para poder cambiar el texto en la pantalla del MainActivity
        } else {
            Log.d("Medicion", "La medicion ya se ha tomado");
        }


    }

    private boolean comprobarBeaconRepetido(TramaIBeacon tib) {

        if (tib.getContador() == contador) { //Si contador del nuevo trama es igual al contador de anterior medida se devuelve falso
            return false;
        } else {
            contador = tib.getContador();
            return true;
        }

    }

    public void buscarTodosLosDispositivosBTLE() {
        callbackLeScan = new BluetoothAdapter.LeScanCallback() {
            @Override
            public void onLeScan(BluetoothDevice bluetoothDevice, int rssi, byte[] bytes) {

                //
                //  se ha encontrado un dispositivo
                //
                mostrarInformacionDispositivoBTLE(bluetoothDevice, rssi, bytes);

            } // onLeScan()
        }; // new LeScanCallback

        //
        //
        //
        boolean resultado = BluetoothAdapter.getDefaultAdapter().startLeScan(callbackLeScan);

        Log.d(ETIQUETA_LOG, " buscarTodosLosDispositivosBTL(): startLeScan(), resultado= " + resultado);
    } // ()


    public void buscarEsteDispositivoBTLE(final UUID dispositivoBuscado) {
        this.scanCallback = new ScanCallback() {
            // Se dispara cada vez que encuentra un dispositivo
            @Override
            public void onScanResult(int callbackType, ScanResult result) {

                // Escaneo de ciclo más alto ya que la app se ejecuta en segundo plano (ahorro de energía)
                super.onScanResult(ScanSettings.SCAN_MODE_LOW_LATENCY, result);
                // Dispostivo encontrado
                byte[] data = result.getScanRecord().getBytes();
                TramaIBeacon tib = new TramaIBeacon(data);
                String strUUIDEncontrado = Utilidades.bytesToString(tib.getUUID());
                Log.d(ETIQUETA_LOG, "API >= 21 - UUID dispositivo encontrado!!!!: " + tib.getUUID().toString());
                if (strUUIDEncontrado.compareTo(Utilidades.uuidToString(dispositivoBuscado)) == 0) {
                    Log.d("Encontrado", "Dispositivo Encontrado");
                    // Detenemos la búsqueda de dispositivos
                    detenerBusquedaDispositivosBTLE();
                    // Mostramos la información de dispositivo
                    mostrarInformacionDispositivoBTLE(result.getDevice(), result.getRssi(), data);
                    // Tratamos el beacon obtenido
                    haLlegadoUnBeacon(tib);
                } else {
                    Log.d(ETIQUETA_LOG, " * UUID buscado >" + Utilidades.uuidToString(dispositivoBuscado) + "< no concuerda con este uuid = >" + strUUIDEncontrado + "<");
                }
            } // onScanResult()

            // Se dispara si el escaneo falla por otros motivos
            @Override
            public void onScanFailed(int errorCode) {
                super.onScanFailed(errorCode);
                Log.d(ETIQUETA_LOG, "Error de callback con id: " + errorCode);
            } // onScanFailed()
        }; // new scanCallback

// Inicialización callback
        BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner().startScan(this.scanCallback);
    } // ()

    //obtenerMedicionEsteDispositivo()

    public void buscarEsteDispositivoBTLEYObtenerMedicion(final UUID dispositivoBuscado) {
        callbackLeScan = new BluetoothAdapter.LeScanCallback() {
            @Override
            public void onLeScan(BluetoothDevice bluetoothDevice, int rssi, byte[] bytes) {

                //
                // dispostivo encontrado
                //

                TramaIBeacon tib = new TramaIBeacon(bytes);
                String uuidString = Utilidades.bytesToString(tib.getUUID());
                Log.d(ETIQUETA_LOG, " * UUID buscando >");

                if (uuidString.compareTo(Utilidades.uuidToString(dispositivoBuscado)) == 0) {
                    detenerBusquedaDispositivosBTLE();
                    mostrarInformacionDispositivoBTLE(bluetoothDevice, rssi, bytes);
                    haLlegadoUnBeacon(tib);
                } else {
                //    Log.d(ETIQUETA_LOG, " * UUID buscado >" + Utilidades.uuidToString(dispositivoBuscado) + "< no concuerda con este uuid = >" + uuidString + "<");
                }


            } // onLeScan()
        }; // new LeScanCallback

        //
        //
        //
        BluetoothAdapter.getDefaultAdapter().startLeScan(callbackLeScan);
    } // ()


    public void buscarEsteDispositivoBTLEYObtenerMedicion(final UUID dispositivoBuscado, final Context context) {
        callbackLeScan = new BluetoothAdapter.LeScanCallback() {
            @Override
            public void onLeScan(BluetoothDevice bluetoothDevice, int rssi, byte[] bytes) {

                //
                // dispostivo encontrado
                //

                TramaIBeacon tib = new TramaIBeacon(bytes);
                String uuidString = Utilidades.bytesToString(tib.getUUID());

                if (uuidString.compareTo(Utilidades.uuidToString(dispositivoBuscado)) == 0) {
                    detenerBusquedaDispositivosBTLE();
                    mostrarInformacionDispositivoBTLE(bluetoothDevice, rssi, bytes);
                    haLlegadoUnBeacon(tib);

                } else {
                    Log.d(ETIQUETA_LOG, " * UUID buscado >" + Utilidades.uuidToString(dispositivoBuscado) + "< no concuerda con este uuid = >" + uuidString + "<");
                }


            } // onLeScan()
        }; // new LeScanCallback

        //
        //
        //
        BluetoothAdapter.getDefaultAdapter().startLeScan(callbackLeScan);
    } // ()

    public void detenerBusquedaDispositivosBTLE() {
        if (callbackLeScan == null) {
            return;
        }

        BluetoothAdapter.getDefaultAdapter().stopLeScan(callbackLeScan);
        callbackLeScan = null;
    } // ()

    private void mostrarInformacionDispositivoBTLE(BluetoothDevice bluetoothDevice, int rssi, byte[] bytes) {

        Log.d(ETIQUETA_LOG, " ****************************************************");
        Log.d(ETIQUETA_LOG, " ****** DISPOSITIVO DETECTADO BTLE ****************** ");
        Log.d(ETIQUETA_LOG, " ****************************************************");
        Log.d(ETIQUETA_LOG, " nombre = " + bluetoothDevice.getName());
        Log.d(ETIQUETA_LOG, " dirección = " + bluetoothDevice.getAddress());
        Log.d(ETIQUETA_LOG, " rssi = " + rssi);

        Log.d(ETIQUETA_LOG, " bytes = " + new String(bytes));
        Log.d(ETIQUETA_LOG, " bytes (" + bytes.length + ") = " + Utilidades.bytesToHexString(bytes));

        TramaIBeacon tib = new TramaIBeacon(bytes);

        Log.d(ETIQUETA_LOG, " ----------------------------------------------------");
        Log.d(ETIQUETA_LOG, " prefijo  = " + Utilidades.bytesToHexString(tib.getPrefijo()));
        Log.d(ETIQUETA_LOG, "          advFlags = " + Utilidades.bytesToHexString(tib.getAdvFlags()));
        Log.d(ETIQUETA_LOG, "          advHeader = " + Utilidades.bytesToHexString(tib.getAdvHeader()));
        Log.d(ETIQUETA_LOG, "          companyID = " + Utilidades.bytesToHexString(tib.getCompanyID()));
        Log.d(ETIQUETA_LOG, "          iBeacon type = " + Integer.toHexString(tib.getiBeaconType()));
        Log.d(ETIQUETA_LOG, "          iBeacon length 0x = " + Integer.toHexString(tib.getiBeaconLength()) + " ( "
                + tib.getiBeaconLength() + " ) ");
        Log.d(ETIQUETA_LOG, " uuid  = " + Utilidades.bytesToHexString(tib.getUUID()));
        Log.d(ETIQUETA_LOG, " uuid  = " + Utilidades.bytesToString(tib.getUUID()));
        Log.d(ETIQUETA_LOG, " major  = " + Utilidades.bytesToHexString(tib.getMajor()) + "( "
                + Utilidades.bytesToInt(tib.getMajor()) + " ) ");
        Log.d(ETIQUETA_LOG, " minor  = " + Utilidades.bytesToHexString(tib.getMinor()) + "( "
                + Utilidades.bytesToInt(tib.getMinor()) + " ) ");
        Log.d(ETIQUETA_LOG, " txPower  = " + Integer.toHexString(tib.getTxPower()) + " ( " + tib.getTxPower() + " )");
        Log.d(ETIQUETA_LOG, " ****************************************************");

        Log.d(ETIQUETA_LOG, " ----------------------------------------------------");
        Log.d(ETIQUETA_LOG, "Distancia estimada entre el Sensor: " + obtenerDistanciaEstimadaEntreSensorYDispositivo(tib.getTxPower(), rssi));
        Log.d(ETIQUETA_LOG, " ----------------------------------------------------");

    } // ()

    // <Byte>, <Byte> --> obtenerDistanciaEstimadaSensorYDispositivo() --> <R>
    public double obtenerDistanciaEstimadaEntreSensorYDispositivo(int txPower, int rssi) { //El sensor debe estar emitiendo para poder obtener la distancia estimada

        Log.d("Distancia", "rssi: " + rssi);
        Log.d("Distancia", "txPower: " + txPower);

        /*double ratio = rssi*1.0/(txPower-7);
        return (0.89976)*Math.pow(ratio,7.7095) + 0.111;*/

        double ratio = rssi * 1.0 / txPower;
        if (ratio < 1.0) {
            return Math.pow(ratio, 10);
        } else {
            return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
        }

    }

    Thread avisador = null;

    public void activarAvisador(int mode, int parameter) {
        /*

        if (ultimaMedicion == null) {
            Log.d("Activador", "Avisador null");
            buscarEsteDispositivoBTLEYObtenerMedicion(Utilidades.stringToUUID("GRUP3-GTI-PROY-3"));
            Toast.makeText(context, "No se detecta el dispositivo. Tienes el bluetooth y el sensor activados?", Toast.LENGTH_SHORT).show();
            return;
        }
         */
        TextView txtview = ((Activity) context).findViewById(R.id.textView_Activador);
        txtview.setText("Avisador activo");
        if (mode == 0) {
            Toast.makeText(context, "Avisador activado con una distancia de " + parameter + " metros.", Toast.LENGTH_SHORT).show();
            avisador = new Thread(new Avisador(mode, parameter));
        } else if (mode == 1) {
            Toast.makeText(context, "Avisador activado con un delay de " + parameter + " milisegundos.", Toast.LENGTH_SHORT).show();
            avisador = new Thread(new Avisador(mode, parameter));
        }
        avisador.start();

    }

    public synchronized void continuarAvisador() {
        if (avisador == null) {
            Log.d("Activador", "Avisador null");
            return;
        }
        isRunning = true;
        Toast.makeText(context, "¡Avisador activo!", Toast.LENGTH_SHORT).show();
        TextView txtview = ((Activity) context).findViewById(R.id.textView_Activador);
        txtview.setText("Avisador activo");
    }

    public synchronized void pausarAvisador() {
        isRunning = false;
        if (avisador == null) {
            Log.d("Activador", "Avisador null");
            return;
        }
        Toast.makeText(context, "¡Avisador pausado!", Toast.LENGTH_SHORT).show();
        TextView txtview = ((Activity) context).findViewById(R.id.textView_Activador);
        txtview.setText("Avisador pausado");
    }


    public void detenerAvisador() {
        if(avisador != null){
        isRunning = false;
        avisador.interrupt();
        avisador = null;
        Toast.makeText(context, "¡Avisador detenido!", Toast.LENGTH_SHORT).show();
        TextView txtview = ((Activity) context).findViewById(R.id.textView_Activador);
        txtview.setText("Avisador detenido");}
    }

    private class Avisador implements Runnable {
        private int cont = 0;

        int mode = -1;
        long parameter;
        long time;

        public Avisador(int mode, long parameter) {
            isRunning = true;
            this.mode = mode;
            this.parameter = parameter;
            this.time = new Date().getTime();;
        }


        public void setCallback() {
            Log.d("Avisador", "buscarEsteDispositivo");
            cont = 0;
            buscarEsteDispositivoBTLEYObtenerMedicion(Utilidades.stringToUUID("GRUP3-GTI-PROY-3"));
        }

        @Override
        public void run() {
            for(;;){
                while (isRunning) {
                    switch (mode) {
                        case 0:
                            //if (setCriterioDistancia()) {}
                            break;
                        case 1:
                            if (setCriterioTiempo()) {
                                Log.d("THREAD", "Time reached!");
                                time = new Date().getTime();
                                setCallback();
                                if(ultimaMedicion!=null)
                                    lf.guardarMedicion(ultimaMedicion);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        public Boolean setCriterioTiempo() {
            //TODO intervalo de tiempo que cuando acabe se avise para obtenerMedicion()
            //Date date1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(ultimaMedicion.getDate());
            Long current = new Date().getTime();
            if (current>=this.time+this.parameter) { //current - date <= tiempo
                return true;
            }
            return false;
            //Enviar aviso
        }

        public Boolean setCriterioDistancia(double distancia) {
            //TODO intervalo cada x tiempo (prob 1 sec) compruebe la distancia entre la última medición y la ubicación actual
            Ubicacion ubicacion = gps.obtenerUbicacion(context);

            Location ubicacionActual = new Location("punto Actual");

            ubicacionActual.setLatitude(ubicacion.getLatitud());
            ubicacionActual.setLongitude(ubicacion.getLongitud());

            Location ubicacionUltimaMedicion = new Location("punto ultima Medicion");

            ubicacionUltimaMedicion.setLatitude(ultimaMedicion.getUbicacion().getLatitud());
            ubicacionUltimaMedicion.setLongitude(ultimaMedicion.getUbicacion().getLongitud());

            float distanciaDesdeUltimaMed = ubicacionActual.distanceTo(ubicacionUltimaMedicion);
            //if calcular distancia entre los dos puntos => distancia --> Avisar
            if (distanciaDesdeUltimaMed >= distancia) return true;
            return false;
        }


    }


}
