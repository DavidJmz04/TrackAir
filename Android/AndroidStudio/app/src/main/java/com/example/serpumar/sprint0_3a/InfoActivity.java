package com.example.serpumar.sprint0_3a;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class InfoActivity extends Activity {

    private static final String ETIQUETA_LOG = "InfoActivity";
    ReceptorBluetooth receptorBluetooth;

    @Override
    protected void onCreate(Bundle savedInstance) {
        super.onCreate(savedInstance);
        setContentView(R.layout.fragment_map);
        receptorBluetooth = new ReceptorBluetooth();
        receptorBluetooth.setContext(this);

        LogicaFake lf = new LogicaFake(this);

        Button obtenerLectura = (Button) findViewById(R.id.botonObtenerLectura);
        obtenerLectura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMediciones" );
                //receptorBluetooth.buscarEsteDispositivoBTLEYObtenerMedicion(Utilidades.stringToUUID( "GRUP3-GTI-PROY-3"));
                receptorBluetooth.buscarEsteDispositivoBTLE(Utilidades.stringToUUID( "GRUP3-GTI-PROY-3"));
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
