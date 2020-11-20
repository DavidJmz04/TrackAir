package com.example.serpumar.sprint0_3a.Fragments;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.serpumar.sprint0_3a.LogicaFake;
import com.example.serpumar.sprint0_3a.LoginActivity;
import com.example.serpumar.sprint0_3a.R;

public class PerfilFragment extends Fragment {

    public void setSesionIniciada(Boolean sesionIniciada) {
        this.sesionIniciada = sesionIniciada;
    }

    private Boolean sesionIniciada = false;



    public PerfilFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        //TODO si esta logeado, se cargan los datos, pero si no Boton login

        View v = inflater.inflate(R.layout.fragment_perfil, container, false);

        SharedPreferences sharedPreferences= getActivity().getPreferences(Context.MODE_PRIVATE);
        int id= sharedPreferences.getInt("id",-1);

        if(id != -1) sesionIniciada= true;

        Button iniciarSesion = (Button) v.findViewById(R.id.boton_login);
        TextView nombre = (TextView) v.findViewById(R.id.nombre_perfil);
        TextView email = (TextView) v.findViewById(R.id.email_perfil);

        LogicaFake logicaFake= new LogicaFake(this.getContext());

        Log.d("id prueba", logicaFake.id_prueba + "" );
        // Inflate the layout for this fragment
        if(logicaFake.id_prueba > -1/*sesionIniciada*/) {

            iniciarSesion.setVisibility(View.INVISIBLE);
            nombre.setVisibility(View.VISIBLE);
            email.setVisibility(View.VISIBLE);

            nombre.setText(LoginActivity.getNombre());


        } else {
            iniciarSesion.setVisibility(View.VISIBLE);
            nombre.setVisibility(View.INVISIBLE);
            email.setVisibility(View.INVISIBLE);

            iniciarSesion.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent i = new Intent(getContext(), LoginActivity.class);
                    startActivity(i);
                }
            });
        }

        return v;
    }
}