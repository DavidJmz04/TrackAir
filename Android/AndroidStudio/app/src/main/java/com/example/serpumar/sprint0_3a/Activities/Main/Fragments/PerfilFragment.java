    package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.Intent;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.app.NotificationCompat;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.serpumar.sprint0_3a.Models.Usuario;
import com.example.serpumar.sprint0_3a.Activities.Login.LoginActivity;
import com.example.serpumar.sprint0_3a.Activities.Main.MainActivity;
import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.Models.ReceptorBluetooth;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Random;

import static java.lang.Integer.parseInt;

    public class PerfilFragment extends Fragment {

        //FIXME: ACCOUNT[] accounts no me pinta be, solucionar i posar guapet; Els callbacks de la vista també junt als components del XML en Java. AccountManager controla tot lo referent a les cuentes de usuari. Ara esta implementat en FAKE, pero s'ha de realitzar com deu mana.

    public PerfilFragment() { }

    //Esta per pulir i optimitzar
    Account[] accounts;
    String CLASS_NAME = "PerfilFragment";
    View v;
    ReceptorBluetooth rb;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        //TODO si esta logeado, se cargan los datos, pero si no Boton login

        v = inflater.inflate(R.layout.fragment_perfil, container, false);

        ConstraintLayout perfilLayout = v.findViewById(R.id.Perfil);
        ConstraintLayout iniciarSesionLayout = v.findViewById(R.id.IniciarSesion);
        Button iniciarSesionBtn = v.findViewById(R.id.boton_login);
        Button cerrarSesionBtn = v.findViewById(R.id.boton_logout);
        LinearLayout encontrarDispositivo = v.findViewById(R.id.item_dispositivo);

        final TextView nombre = v.findViewById(R.id.nombre_perfil);
        final TextView nombreUsuario = v.findViewById(R.id.usuario_perfil);
        final TextView reputacion = v.findViewById(R.id.puntuacion_perfil);

        final TextView email = v.findViewById(R.id.correo_perfil);
        final TextView telefono = v.findViewById(R.id.telefono_perfil);


        final Intent mainIntent = new Intent(getContext(), MainActivity.class);
        final Intent loginIntent = new Intent(getContext(), LoginActivity.class);

        final AccountManager accountManager = AccountManager.get(getActivity());

        // Inflate the layout for this fragment
        if (((MainActivity)getActivity()).isLogged()) {
            perfilLayout.setVisibility(View.VISIBLE);
            iniciarSesionLayout.setVisibility(View.INVISIBLE);
            //nombre.setText(accountManager.getAccounts()[0].name);
            cerrarSesionBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    accounts = accountManager.getAccounts();
                    accountManager.removeAccountExplicitly(accounts[0]);
                    startActivity(mainIntent);

                }
            });

            rb = ((MainActivity)getActivity()).getReceptorBluetooth();

            encontrarDispositivo.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    //rb.setDistanciaEstimada(new Random(System.currentTimeMillis()).nextInt(3));
                    int distancia = rb.getDistanciaEstimada();
                    String content = "";
                    if(distancia != -1) {
                        content = (String.valueOf(rb.getDistanciaEstimada()) + " m.");
                    } else {
                        content = ("Antes debes tomar una medición");
                    }
                    ((MainActivity)getActivity()).mostrarToast("Distancia", content);
                }
            });

            Usuario usuario = ((MainActivity)getActivity()).getUsuario();

            email.setText(usuario.getCorreo());
            reputacion.setText("Puntos: " + String.valueOf(usuario.getPuntosCanjeables()));
            nombreUsuario.setText("@"+usuario.getNombreUsuario());
            nombre.setText(usuario.getNombreCompleto());
            telefono.setText(String.valueOf(usuario.getTelefono()));


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