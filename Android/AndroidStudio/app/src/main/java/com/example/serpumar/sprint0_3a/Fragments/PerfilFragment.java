    package com.example.serpumar.sprint0_3a.Fragments;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.Intent;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.serpumar.sprint0_3a.LogicaFake;
import com.example.serpumar.sprint0_3a.MainActivity;
import com.example.serpumar.sprint0_3a.NetworkManager;
import com.example.serpumar.sprint0_3a.R;

import java.io.IOException;

    public class PerfilFragment extends Fragment {

        //FIXME: ACCOUNT[] accounts no me pinta be, solucionar i posar guapet; Els callbacks de la vista també junt als components del XML en Java. AccountManager controla tot lo referent a les cuentes de usuari. Ara esta implementat en FAKE, pero s'ha de realitzar com deu mana.

    public PerfilFragment() { }

    //Esta per pulir i optimitzar
    Account[] accounts;
    String CLASS_NAME = "PerfilFragment";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        //TODO si esta logeado, se cargan los datos, pero si no Boton login

        View v = inflater.inflate(R.layout.fragment_perfil, container, false);

        ConstraintLayout perfilLayout = v.findViewById(R.id.Perfil);
        ConstraintLayout iniciarSesionLayout = v.findViewById(R.id.IniciarSesion);
        Button iniciarSesionBtn = v.findViewById(R.id.boton_login);
        Button cerrarSesionBtn = v.findViewById(R.id.boton_logout);
        TextView nombre = v.findViewById(R.id.nombre_perfil);
        TextView email = v.findViewById(R.id.email_perfil);


        final Intent mainIntent = new Intent(getContext(), MainActivity.class);
        final Intent loginIntent = new Intent(getContext(), LoginActivity.class);

        final AccountManager accountManager = AccountManager.get(getContext());

        // Inflate the layout for this fragment
        if ((accounts = accountManager.getAccounts()).length>0) {
            perfilLayout.setVisibility(View.VISIBLE);
            iniciarSesionLayout.setVisibility(View.INVISIBLE);
            nombre.setText(accountManager.getAccounts()[0].name);
            cerrarSesionBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    accountManager.removeAccountExplicitly(accounts[0]);
                    startActivity(mainIntent);

                }
            });
        } else {
            iniciarSesionLayout.setVisibility(View.VISIBLE);
            perfilLayout.setVisibility(View.INVISIBLE);

            iniciarSesionBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    startActivity(loginIntent);
                }
            });
        }

        return v;
    }
}