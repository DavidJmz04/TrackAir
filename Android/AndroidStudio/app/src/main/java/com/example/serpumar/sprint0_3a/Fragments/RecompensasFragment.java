package com.example.serpumar.sprint0_3a.Fragments;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.serpumar.sprint0_3a.Adapters.RecompensasAdapter;
import com.example.serpumar.sprint0_3a.ClasesPojo.Recompensa;
import com.example.serpumar.sprint0_3a.NetworkManager;
import com.example.serpumar.sprint0_3a.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class RecompensasFragment extends Fragment {

    RecyclerView recyclerRecompensas;
    ArrayList<Recompensa> listaRecompensas;

    public RecompensasFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,  Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_recompensas, container, false);

        listaRecompensas = new ArrayList<>();
        recyclerRecompensas = view.findViewById(R.id.recyclerId);
        recyclerRecompensas.setLayoutManager(new LinearLayoutManager(getContext()));

        llenarLista();

        return view;
    }

    private void llenarLista() {

        //Obtener recompensas y añadirlas a la lista
        NetworkManager.getInstance().getRequest("/recompensas", new NetworkManager.ControladorRespuestas<String>() {
            @Override
            public void getResult(String object) {
                try {
                    JSONArray jsonArray= new JSONArray(object);
                    for(int i=0; i<jsonArray.length(); i++){

                        //TODO Hacer un switch de imagenes
                        JSONObject recompensa= jsonArray.getJSONObject(i);
                        listaRecompensas.add(new Recompensa(recompensa.getInt("id"),recompensa.getString("titulo"), recompensa.getString("descripcion"), recompensa.getInt("coste"),R.drawable.ic_baseline_stars_24));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RecompensasAdapter adapter = new RecompensasAdapter(listaRecompensas, getContext());
                recyclerRecompensas.setAdapter(adapter);
            }
        });
    }
}