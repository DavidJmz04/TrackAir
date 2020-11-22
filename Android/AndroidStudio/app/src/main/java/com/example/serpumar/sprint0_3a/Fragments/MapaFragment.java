package com.example.serpumar.sprint0_3a.Fragments;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.serpumar.sprint0_3a.GPS;
import com.example.serpumar.sprint0_3a.LogicaFake;
import com.example.serpumar.sprint0_3a.NetworkManager;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.ReceptorBluetooth;
import com.example.serpumar.sprint0_3a.Utilidades;


public class MapaFragment extends Fragment {

    private static String ETIQUETA_LOG = "MapaFragment";
    private ReceptorBluetooth receptorBluetooth = new ReceptorBluetooth();

    private GPS gps = new GPS();
    public LogicaFake lf;

    public MapaFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        final View view = inflater.inflate(R.layout.fragment_map, container, false);

        receptorBluetooth.setContext(getContext());

        lf = new LogicaFake(this.getContext());

        Button obtenerLectura = (Button) view.findViewById(R.id.botonObtenerLectura);
        obtenerLectura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMediciones" );
                receptorBluetooth.buscarEsteDispositivoBTLEYObtenerMedicion(Utilidades.stringToUUID( "GRUP3-GTI-PROY-3"));
                }
        });

        Button subirLectura = (Button) view.findViewById(R.id.botonSubirLectura);
        subirLectura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMediciones" );
                if(receptorBluetooth.getUltimaMedicion() != null)
                    lf.guardarMedicion(receptorBluetooth.getUltimaMedicion());
                else
                    Toast.makeText(getContext(), "Primero debes tomar una lectura", Toast.LENGTH_SHORT).show();
            }
        });

        Button obtenerMediciones = (Button) view.findViewById(R.id.botonObtenerMediciones);
        obtenerMediciones.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getContext(),"HOLA",Toast.LENGTH_LONG).show();
                Log.d(ETIQUETA_LOG, " boton obtenerMediciones" );
                NetworkManager.getInstance().getRequest("/mediciones", new NetworkManager.ControladorRespuestas<String>() {
                    @Override
                    public void getResult(String object) {
                        Log.d("MapaFragment",object);
                        Toast.makeText(getContext(),"a- " + object,Toast.LENGTH_LONG).show();
                    }
                });
            }
        });

        Button obtenerMedicionesOficialesAPI = (Button) view.findViewById(R.id.botonObtenerMedicionesOficialesAPI);
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

        Button obtenerMedicionesOficialesLOCAL = (Button) view.findViewById(R.id.botonObtenerMedicionesOficialesLOCAL);
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

        Button activarAvisador = (Button) view.findViewById(R.id.botonActivarAvisador);
        activarAvisador.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton activar avisador" );
                EditText parametro = (EditText)view.findViewById(R.id.parametroAvisador);
                receptorBluetooth.activarAvisador(1,Integer.parseInt(parametro.getText().toString()));
            }
        });

        Button continuarAvisador = (Button) view.findViewById(R.id.botonContinuarAvisador);
        continuarAvisador.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton continuar avisador" );
                receptorBluetooth.continuarAvisador();
            }
        });

        Button pausarAvisador = (Button) view.findViewById(R.id.botonPausarAvisador);
        pausarAvisador.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton pausar avisador" );
                receptorBluetooth.pausarAvisador();
            }
        });

        Button detenerAvisador = (Button) view.findViewById(R.id.botonDetenerAvisador);
        detenerAvisador.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton detener avisador" );
                receptorBluetooth.detenerAvisador();
            }
        });

        return view;

    }
}