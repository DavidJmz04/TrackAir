    package com.example.serpumar.sprint0_3a.Fragments;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.Intent;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
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

import com.example.serpumar.sprint0_3a.ClasesPojo.Usuario;
import com.example.serpumar.sprint0_3a.LoginActivity;
import com.example.serpumar.sprint0_3a.LogicaFake;
import com.example.serpumar.sprint0_3a.MainActivity;
import com.example.serpumar.sprint0_3a.NetworkManager;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.LoginActivity;
import com.example.serpumar.sprint0_3a.ReceptorBluetooth;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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

        final AccountManager accountManager = AccountManager.get(getContext());

        // Inflate the layout for this fragment
        if ((accounts = accountManager.getAccounts()).length>0) {
            perfilLayout.setVisibility(View.VISIBLE);
            iniciarSesionLayout.setVisibility(View.INVISIBLE);
            //nombre.setText(accountManager.getAccounts()[0].name);
            cerrarSesionBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    accountManager.removeAccountExplicitly(accounts[0]);
                    startActivity(mainIntent);

                }
            });

            encontrarDispositivo.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    mostrarToast();
                    Log.d("TAGGGG", "onClick: ENCONTRAR DISPOSITIVO");
                }
            });

            int idUsuario = parseInt(accountManager.getUserData(accountManager.getAccounts()[0], "id"));

            NetworkManager.getInstance().getRequest("/usuario/" + idUsuario, new NetworkManager.ControladorRespuestas<String>() {
                @Override
                public void getResult(String object) {

                    try {

                        JSONArray jsonArray = new JSONArray(object);
                        JSONObject usuarioJSON = jsonArray.getJSONObject(0);

                        Usuario usuario = new Usuario(usuarioJSON.getInt("id"), usuarioJSON.getString("nombre"), usuarioJSON.getString("nombre_usuario"), usuarioJSON.getString("contrasenya"), usuarioJSON.getString("correo"), usuarioJSON.getInt("puntuacion"), usuarioJSON.getInt("puntos_canjeables"), usuarioJSON.getString("telefono"), usuarioJSON.getString("id_nodo"));
                        email.setText(usuario.getCorreo());
                        reputacion.setText(String.valueOf(usuario.getPuntuacion()));
                        nombreUsuario.setText("@"+usuario.getNombreUsuario());
                        nombre.setText(usuario.getNombreCompleto());
                        telefono.setText(String.valueOf(usuario.getTelefono()));

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
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

    private void mostrarToast() {
        LayoutInflater inflater = getLayoutInflater();
        View layout = inflater.inflate(R.layout.toast_personalizado, (ViewGroup)v.findViewById(R.id.toastpersonalizado));
        TextView textView = layout.findViewById(R.id.txtDistanciaToast);
        int distancia = rb.getDistanciaEstimada();
        if(distancia != -1) {
            textView.setText(String.valueOf(rb.getDistanciaEstimada()));
        } else {
            textView.setText("Antes debes tomar una medición");
        }

        Toast toast = new Toast(getContext());
        toast.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL, 0, 0);
        toast.setDuration(Toast.LENGTH_SHORT);
        toast.setView(layout);
        toast.show();
    }
}