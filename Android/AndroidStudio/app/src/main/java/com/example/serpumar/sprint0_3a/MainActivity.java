// ------------------------------------------------------------------
// ------------------------------------------------------------------

package com.example.serpumar.sprint0_3a;

// ------------------------------------------------------------------
// ------------------------------------------------------------------
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
<<<<<<< Updated upstream

import java.util.UUID;
=======
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.example.serpumar.sprint0_3a.Fragments.MapaFragment;
import com.example.serpumar.sprint0_3a.Fragments.PerfilFragment;
import com.example.serpumar.sprint0_3a.Fragments.RecompensasFragment;
import com.example.serpumar.sprint0_3a.Notificaciones.ServicioNotificaciones;
import com.google.android.material.bottomnavigation.BottomNavigationView;
>>>>>>> Stashed changes

// ------------------------------------------------------------------
// ------------------------------------------------------------------

public class MainActivity extends AppCompatActivity {

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    private static String ETIQUETA_LOG = ">>>>";
    private ReceptorBluetooth receptorBluetooth = new ReceptorBluetooth();

    private GPS gps = new GPS();
    private LogicaFake lf = new LogicaFake();


<<<<<<< Updated upstream
    // --------------------------------------------------------------
    // --------------------------------------------------------------
    public void botonBuscarDispositivosBTLEPulsado( View v ) {
        Log.d(ETIQUETA_LOG, " boton buscar dispositivos BTLE Pulsado" );
        receptorBluetooth.buscarTodosLosDispositivosBTLE();

    } // ()
=======
        AccountManager accountManager = AccountManager.get(this);

        startService();
    } // onCreate()
>>>>>>> Stashed changes

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    public void botonBuscarNuestroDispositivoBTLEPulsado( View v ) {
        Log.d(ETIQUETA_LOG, "-- boton nuestro dispositivo BTLE Pulsado" );
        receptorBluetooth.buscarEsteDispositivoBTLE( Utilidades.stringToUUID( "GRUP3-GTI-PROY-3" ), this );

    } // ()

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    public void botonDetenerBusquedaDispositivosBTLEPulsado( View v ) {
        Log.d(ETIQUETA_LOG, " boton nuestro dispositivo BTLE Detenido" );
        receptorBluetooth.detenerBusquedaDispositivosBTLE();
    } // ()


    // --------------------------------------------------------------
    // --------------------------------------------------------------
    public void botonObtenerMedicionDeBDD( View v ) {
        Log.d(ETIQUETA_LOG, " boton obtener medicion bdd" );
        lf.obtenerMedicion(this);

    } // ()

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    } // onCreate()

    public void startService() {
        Intent serviceIntent = new Intent(this, ServicioNotificaciones.class);
        serviceIntent.putExtra("inputExtra", "Para desactivarlo cierre la app");
        ContextCompat.startForegroundService(this, serviceIntent);
    }
} // class
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

