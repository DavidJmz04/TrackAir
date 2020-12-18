package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

import android.app.Activity;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ExpandableListView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import com.example.serpumar.sprint0_3a.Activities.Main.Adapters.FiltrosMapaAdapter;
import com.example.serpumar.sprint0_3a.Models.FiltrosMapa;
import com.example.serpumar.sprint0_3a.R;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import butterknife.internal.DebouncingOnClickListener;

public class MapaFragment_filtros extends Fragment {


        LinearLayout linearLayout;

        Button applyFiltersButton;

        TextView textviewReset;

        ExpandableListView expandablelistviewFilter;

        FragmentActivity mContext;
        MapaFragment mapFr = new MapaFragment();
        List<FiltrosMapa> listDataHeader;
        HashMap<String, List<String>> listDataChild;

        FiltrosMapaAdapter listAdapter;

        private OnFragmentInteractionListener mListener;


    public MapaFragment_filtros(Fragment targetFragment) {
        this.setTargetFragment(targetFragment,0);
    }



        @Override
        public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
            super.onViewCreated(view, savedInstanceState);
            expandablelistviewFilter = view.findViewById(R.id.expandablelistview_filter);
            linearLayout = view.findViewById(R.id.linearlayout_filter);
            applyFiltersButton = view.findViewById(R.id.applyFiltersBtn);
            textviewReset = view.findViewById(R.id.button_reset);
            prepareListData();
        }

        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            if (getArguments() != null) {

            }
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                Bundle savedInstanceState) {
            // Inflate the layout for this fragment
            View view = inflater.inflate(R.layout.fragment_filter, container, false);
            return view;
        }

        private void prepareListData() {
            listDataHeader = new ArrayList<FiltrosMapa>();
            listDataChild = new HashMap<>();
            // Adding child data
            listDataHeader.add(new FiltrosMapa("Gases", "Todos los gases"));
            //listDataHeader.add(new FiltrosMapa("Datos", "Seleccionar que datos ver"));
            //listDataHeader.add(new FiltrosMapa("Color", "Color de los datos"));


// Adding child data
            List<String> gases = new ArrayList<>();
            gases.add("Gas irritante"); //GI
            gases.add("CO2"); //CO2
            gases.add("NO2"); //NO2
            gases.add("O3"); //03
            gases.add("SO2"); //SO2

            /*List<String> datos = new ArrayList<>();
            datos.add("Mis datos");
            datos.add("Demás usuarios");
            datos.add("Mis datos y demás usuarios");*/

            /*List<String> colorDeMisDatos = new ArrayList<>();
            colorDeMisDatos.add("Azul");
            colorDeMisDatos.add("Rojo");
            colorDeMisDatos.add("Verde");
            colorDeMisDatos.add("Amarillo");*/


            listDataChild.put(listDataHeader.get(0).getTitle(), gases); // Header, Child data
            //listDataChild.put(listDataHeader.get(1).getTitle(), datos);
            //listDataChild.put(listDataHeader.get(1).getTitle(), colorDeMisDatos);

            listAdapter = new FiltrosMapaAdapter(mContext, listDataHeader, listDataChild);
            expandablelistviewFilter.setAdapter(listAdapter);

            linearLayout.setOnClickListener(new DebouncingOnClickListener() {
                @Override
                public void doClick(View v) {
                    volverAlMapa();
                }
            });

            applyFiltersButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    volverAlMapa();
                }
            });

        }

        @Override
            public void onAttach(Activity activity) {
            mContext=(FragmentActivity) activity;
            super.onAttach(activity);
        }

        @Override
        public void onDetach() {
            super.onDetach();
            mListener = null;
        }

        public interface OnFragmentInteractionListener {
            // : Update argument type and name
            void onFragmentInteraction(Uri uri);
        }

        private void volverAlMapa() {
            ((MapaFragment)getTargetFragment()).reloadFragment();
            androidx.fragment.app.FragmentManager fragmentManager = getFragmentManager();
            fragmentManager.popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);
            fragmentManager.popBackStackImmediate();
        }


}
