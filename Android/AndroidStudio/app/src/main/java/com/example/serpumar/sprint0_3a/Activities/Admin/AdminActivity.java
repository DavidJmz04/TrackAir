package com.example.serpumar.sprint0_3a.Activities.Admin;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;

import com.example.serpumar.sprint0_3a.Helpers.Utilities;
import com.example.serpumar.sprint0_3a.Helpers.LogicaFake;
import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.Models.ReceptorBluetooth;

public class AdminActivity extends Activity {

    private static final String ETIQUETA_LOG = "InfoActivity";
    ReceptorBluetooth receptorBluetooth;

    @Override
    protected void onCreate(Bundle savedInstance) {
        super.onCreate(savedInstance);
        setContentView(R.layout.fragment_map);

        Button obtenerLectura = (Button) findViewById(R.id.botonObtenerLectura);
        obtenerLectura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMediciones" );
                //receptorBluetooth.buscarEsteDispositivoBTLEYObtenerMedicion(Utilidades.stringToUUID( "GRUP3-GTI-PROY-3"));
                receptorBluetooth.buscarEsteDispositivoBTLE(Utilities.stringToUUID( "GRUP3-GTI-PROY-3"));
            }
        });

        Button subirLectura = (Button) findViewById(R.id.botonSubirLectura);
        subirLectura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                NotificationManager notificationManager =
                        (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

                NotificationCompat.Builder notifLimites = new NotificationCompat.Builder(getApplicationContext(), "1")
                        .setContentTitle("Alerta")
                        .setContentText("Prueba")
                        .setSmallIcon(R.drawable.common_google_signin_btn_icon_dark);
// === Removed some obsoletes
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                {
                    String channelId = "Your_channel_id";
                    NotificationChannel channel = new NotificationChannel(
                            channelId,
                            "Channel human readable title",
                            NotificationManager.IMPORTANCE_HIGH);
                    notificationManager.createNotificationChannel(channel);
                    notifLimites.setChannelId(channelId);
                }
                notificationManager.notify(2, notifLimites.build());
            }
        });

        Button obtenerMediciones = (Button) findViewById(R.id.botonObtenerMediciones);
        obtenerMediciones.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(),"HOLA",Toast.LENGTH_LONG).show();
                Log.d(ETIQUETA_LOG, " boton obtenerMediciones" );
                NetworkManager.getInstance().getRequest("/mediciones", new NetworkManager.ControladorRespuestas<String>() {
                    @Override
                    public void getResult(String object) {
                        Log.d("MapaFragment",object);
                        Toast.makeText(getApplicationContext(),"a- " + object,Toast.LENGTH_LONG).show();
                    }
                });
            }
        });

        Button obtenerMedicionesOficialesAPI = (Button) findViewById(R.id.botonObtenerMedicionesOficialesAPI);
        obtenerMedicionesOficialesAPI.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMedicionesOficiales" );
                //lf.obtenerMedicionesOficialesAPI(getContext());
                NetworkManager.getInstance().getRequest("/medicionesOficiales", new NetworkManager.ControladorRespuestas<String>() {
                    @Override
                    public void getResult(String object) {
                        Log.d("MapaFragment",object);
                    }
                });
            }
        });

        Button obtenerMedicionesOficialesLOCAL = (Button) findViewById(R.id.botonObtenerMedicionesOficialesLOCAL);
        obtenerMedicionesOficialesLOCAL.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMedicionesOficialesLOCAL" );
                //lf.obtenerMedicionesOficialesLOCAL(getContext());
                NetworkManager.getInstance().getRequest("/medicionesOficialesCSV", new NetworkManager.ControladorRespuestas<String>() {
                    @Override
                    public void getResult(String object) {
                        Log.d("MapaFragment",object);
                    }
                });
            }
        });

        Button activarAvisador = (Button) findViewById(R.id.botonActivarAvisador);
        activarAvisador.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton activar avisador" );
                EditText parametro = (EditText) findViewById(R.id.parametroAvisador);
                receptorBluetooth.activarAvisador(1,Integer.parseInt(parametro.getText().toString()));
            }
        });

        Button continuarAvisador = (Button) findViewById(R.id.botonContinuarAvisador);
        continuarAvisador.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton continuar avisador" );
                receptorBluetooth.continuarAvisador();
            }
        });

        Button pausarAvisador = (Button) findViewById(R.id.botonPausarAvisador);
        pausarAvisador.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton pausar avisador" );
                receptorBluetooth.pausarAvisador();
            }
        });

        Button detenerAvisador = (Button) findViewById(R.id.botonDetenerAvisador);
        detenerAvisador.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton detener avisador" );
                receptorBluetooth.detenerAvisador();
            }
        });
    }
}
