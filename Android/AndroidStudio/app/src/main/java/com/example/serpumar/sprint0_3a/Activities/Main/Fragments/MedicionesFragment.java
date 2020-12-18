package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

import android.accounts.AccountManager;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.Models.ReceptorBluetooth;
import com.example.serpumar.sprint0_3a.R;

import org.json.JSONArray;
import org.json.JSONException;

import static java.lang.Integer.parseInt;

public class MedicionesFragment extends Fragment {
    ReceptorBluetooth receptorBluetooth;
    ViewGroup viewgroup;

    public MedicionesFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_mediciones2, container, false);
        WebView wv = v.findViewById(R.id.webview);
         viewgroup = (ViewGroup) v.findViewById(R.id.toastpersonalizado);

        final Button buttonMediciones = (Button) v.findViewById(R.id.MedicionesButton);
        buttonMediciones.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (!receptorBluetooth.isRunning) {
                    mostrarToast("Midiendo...", "El lector se ha iniciado");
                    receptorBluetooth.activarAvisador(1, 5000);
                    buttonMediciones.setText("PARAR DE MEDIR");
                }else{
                    mostrarToast("Midiendo...", "El lector se ha detenido");
                    receptorBluetooth.detenerAvisador();
                    buttonMediciones.setText("EMPEZAR A MEDIR");
                }
            }
        });

        final TextView tv = v.findViewById(R.id.calidadAire);
        NetworkManager networkManager = NetworkManager.getInstance(getContext());
        try {
            int idUsuario = parseInt(AccountManager.get(getContext()).getUserData(AccountManager.get(getContext()).getAccountsByType("com.example.serpumar.sprint0_3a")[0], "id"));
            Log.i("TAB", idUsuario + "");
            tv.setText("No hay datos");
            NetworkManager.getInstance().getRequest("/calidadAire/" + idUsuario, new NetworkManager.ControladorRespuestas<String>() {
                @Override
                public void getResult(String object) {
                    try {
                        JSONArray jsonArray = new JSONArray(object);
                        String calidadMedia = jsonArray.getJSONObject(0).getString("calidadMedia");
                        tv.setText(calidadMedia);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

            });
        }catch (Exception e){
            tv.setText("No hay datos");
        }
        wv.getSettings().setJavaScriptEnabled(true);
        wv.loadUrl("https://igmagi.upv.edu.es/datosMobile.html");


        return v;
    }

    public void mostrarToast(String title, String content) {
        LayoutInflater inflater = getLayoutInflater();
        View layout = inflater.inflate(R.layout.toast_personalizado, viewgroup);
        TextView textView = layout.findViewById(R.id.txtDistanciaToast);
        textView.setText(content);
        TextView textView1 = layout.findViewById(R.id.txtTituloToast);
        textView1.setText(title);
        Toast toast = new Toast(getContext());
        toast.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL, 0, 0);
        toast.setDuration(Toast.LENGTH_SHORT);
        toast.setView(layout);
        toast.show();
    }

    public ReceptorBluetooth getReceptorBluetooth() {
        return receptorBluetooth;
    }
}