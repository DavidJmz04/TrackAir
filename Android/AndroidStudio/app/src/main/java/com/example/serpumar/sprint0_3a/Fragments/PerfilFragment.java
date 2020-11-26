    package com.example.serpumar.sprint0_3a.Fragments;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.Intent;
import android.os.Bundle;

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

public class PerfilFragment extends Fragment {

    public PerfilFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        //TODO si esta logeado, se cargan los datos, pero si no Boton login

        View v = inflater.inflate(R.layout.fragment_perfil, container, false);

        final Intent i = new Intent(getActivity(), MainActivity.class);
        Button iniciarSesion = v.findViewById(R.id.boton_login);
        TextView nombre = v.findViewById(R.id.nombre_perfil);
        TextView email = v.findViewById(R.id.email_perfil);

        LogicaFake logicaFake = new LogicaFake(this.getContext());


        final AccountManager accountManager = AccountManager.get(getContext());

        // Inflate the layout for this fragment
        if (accountManager.getAccounts().length>0) {

            iniciarSesion.setVisibility(View.VISIBLE);
            iniciarSesion.setText("Cerrar sesion");
            nombre.setVisibility(View.VISIBLE);
            email.setVisibility(View.INVISIBLE);

            nombre.setText(accountManager.getAccounts()[0].name);
            Toast.makeText(getContext(), accountManager.getAccounts().length + " - a", Toast.LENGTH_LONG).show();
            iniciarSesion.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Account[] accounts = AccountManager.get(getContext()).getAccounts();
                    for (Account account1 : accounts) {
                        accountManager.removeAccount(account1,getActivity(),null,null);
                    }
                    Toast.makeText(getContext(), accountManager.getAccounts().length + " - a", Toast.LENGTH_LONG).show();
                }
            });
        } else {
            iniciarSesion.setVisibility(View.VISIBLE);
            iniciarSesion.setText("Iniciar sesion");
            nombre.setVisibility(View.INVISIBLE);
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

                    NetworkManager.getInstance(getContext());
                    startActivity(i);
                }
            });
        }

        return v;
    }
}