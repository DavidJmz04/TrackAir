package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

import android.accounts.AccountManager;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.TextView;

import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.R;

import org.json.JSONArray;
import org.json.JSONException;

import static java.lang.Integer.parseInt;

public class MedicionesFragment extends Fragment {


    public MedicionesFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_mediciones, container, false);
        WebView wv = v.findViewById(R.id.webview);

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
}