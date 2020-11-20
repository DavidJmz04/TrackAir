package com.example.serpumar.sprint0_3a.Fragments;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.serpumar.sprint0_3a.ClasesPojo.RecompensasPojo;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.Adapters.RecompensasAdapter;

import java.util.ArrayList;

public class RecompensasFragment extends Fragment {

    RecyclerView recyclerRecompensas;
    ArrayList<RecompensasPojo> listaRecompensas;

    public RecompensasFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_recompensas, container, false);

        listaRecompensas = new ArrayList<>();
        recyclerRecompensas = view.findViewById(R.id.recyclerId);
        recyclerRecompensas.setLayoutManager(new LinearLayoutManager(getContext()));

        llenarLista();

        RecompensasAdapter adapter = new RecompensasAdapter(listaRecompensas);
        recyclerRecompensas.setAdapter(adapter);

        return view;
    }

    private void llenarLista() {
        listaRecompensas.add(new RecompensasPojo("Hamgurguesa","Hamburguesa en la cadena de comida McKing", R.drawable.ic_baseline_stars_24, 231));
        listaRecompensas.add(new RecompensasPojo("Entrada de Cine","Entrada de los cines ABD", R.drawable.ic_baseline_stars_24, 232));
        listaRecompensas.add(new RecompensasPojo("Entrada de Cine","Entrada de los cines ABD", R.drawable.ic_baseline_stars_24, 233));
        listaRecompensas.add(new RecompensasPojo("Entrada de Cine","Entrada de los cines ABD", R.drawable.ic_baseline_stars_24, 234));

    }
}