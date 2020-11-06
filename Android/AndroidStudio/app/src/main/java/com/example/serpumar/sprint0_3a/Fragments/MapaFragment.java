package com.example.serpumar.sprint0_3a.Fragments;

import android.app.Activity;
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
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.ReceptorBluetooth;
import com.example.serpumar.sprint0_3a.Utilidades;


public class MapaFragment extends Fragment {

    private static String ETIQUETA_LOG = ">>>>";
    private ReceptorBluetooth receptorBluetooth = new ReceptorBluetooth();

    private GPS gps = new GPS();

    public MapaFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        final View view = inflater.inflate(R.layout.fragment_map, container, false);

        receptorBluetooth.setContext(getContext());

        Button obtenerLectura = (Button) view.findViewById(R.id.botonObtenerLectura);
        obtenerLectura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMediciones" );
                receptorBluetooth.buscarEsteDispositivoBTLEYObtenerMedicion(Utilidades.stringToUUID( "GRUP3-GTI-PROY-3"));
                }
        });

        Button obtenerMediciones = (Button) view.findViewById(R.id.botonObtenerMediciones);
        obtenerMediciones.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMediciones" );
                lf.obtenerMedicion(getContext());
            }
        });

        Button obtenerMedicionesOficialesAPI = (Button) view.findViewById(R.id.botonObtenerMedicionesOficialesAPI);
        obtenerMedicionesOficialesAPI.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMedicionesOficiales" );
                lf.obtenerMedicionesOficialesAPI(getContext());
            }
        });

        Button obtenerMedicionesOficialesLOCAL = (Button) view.findViewById(R.id.botonObtenerMedicionesOficialesLOCAL);
        obtenerMedicionesOficialesLOCAL.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(ETIQUETA_LOG, " boton obtenerMedicionesOficialesLOCAL" );
                lf.obtenerMedicionesOficialesLOCAL(getContext());
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