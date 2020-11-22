    package com.example.serpumar.sprint0_3a.Fragments;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.accounts.AuthenticatorException;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.serpumar.sprint0_3a.LogicaFake;
import com.example.serpumar.sprint0_3a.LoginActivity;
import com.example.serpumar.sprint0_3a.MainActivity;
import com.example.serpumar.sprint0_3a.NetworkManager;
import com.example.serpumar.sprint0_3a.R;

import java.io.IOException;

    public class PerfilFragment extends Fragment {

        //TODO: Optimizar el login con la cuenta de usuario e implementar la conexión a la base de datos para verificar las cuentas
        //FIXME: ACCOUNT[] accounts no me pinta be, solucionar i posar guapet; Els callbacks de la vista també junt als components del XML en Java. AccountManager controla tot lo referent a les cuentes de usuari. Ara esta implementat en FAKE, pero s'ha de realitzar com deu mana.

    public PerfilFragment() { }

    //Esta per pulir i optimitzar
    Account[] accounts;
    String CLASS_NAME = "PerfilFragment";


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_perfil, container, false);

        final Intent i = new Intent(getActivity(), MainActivity.class);
        Button iniciarSesion = v.findViewById(R.id.boton_login);
        TextView nombre = v.findViewById(R.id.nombre_perfil);
        TextView email = v.findViewById(R.id.email_perfil);

        LogicaFake logicaFake = new LogicaFake(this.getContext());


        final AccountManager accountManager = AccountManager.get(getContext());

        // FIXME: Arreglar esta part sobretot, fa pudor tot, per visible e invisible de tantes coses, probablement centrar tots els components de l'usuari not logged en un layout i l'usuari logged en altre i sols mostrar/ocultar el que pertoque.
        // Inflate the layout for this fragment
        if ((accounts = accountManager.getAccounts()).length>0) {
            iniciarSesion.setVisibility(View.VISIBLE);
            iniciarSesion.setText("Cerrar sesion");
            nombre.setVisibility(View.VISIBLE);
            email.setVisibility(View.INVISIBLE);
            nombre.setText(accountManager.getAccounts()[0].name);
            iniciarSesion.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.i(CLASS_NAME, "Click");
                    accountManager.removeAccountExplicitly(accounts[0]);
                    startActivity(i);
                }
            });
        } else {
            iniciarSesion.setVisibility(View.VISIBLE);
            iniciarSesion.setText("Iniciar sesion");
            nombre.setVisibility(View.VISIBLE);
            email.setVisibility(View.INVISIBLE);
            nombre.setText("No hay cuenta!");

            iniciarSesion.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Account account = new Account("Test usuario","com.example.serpumar.sprint0_3a");
                    boolean success = accountManager.addAccountExplicitly(account,"password",null);
                    if(success){
                        Toast.makeText(getContext(),"Account created",Toast.LENGTH_SHORT).show();
                    }else{
                        Toast.makeText(getContext(),"Account creation failed. Look at previous logs to investigate",Toast.LENGTH_SHORT).show();
                    }

                    Account[] accounts = AccountManager.get(getContext()).getAccounts();
                    for (Account account1 : accounts) {
                        Toast.makeText(getContext(), "Name: " + account1.name+" Type: " + account1.type,Toast.LENGTH_SHORT).show();
                    }
                    startActivity(i);
                }
            });
        }

        return v;
    }
}