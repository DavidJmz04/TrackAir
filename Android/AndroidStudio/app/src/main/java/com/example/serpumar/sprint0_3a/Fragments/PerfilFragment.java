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

    public PerfilFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        //TODO si esta logeado, se cargan los datos, pero si no Boton login

        View v = inflater.inflate(R.layout.fragment_perfil, container, false);

        Button iniciarSesion = v.findViewById(R.id.boton_login);
        TextView nombre = v.findViewById(R.id.nombre_perfil);
        TextView email = v.findViewById(R.id.email_perfil);

        LogicaFake logicaFake = new LogicaFake(this.getContext());

        // Inflate the layout for this fragment
        if (logicaFake.id != -1/*sesionIniciada*/) {

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