package com.example.serpumar.sprint0_3a.Fragments;

import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ExpandableListView;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import com.example.serpumar.sprint0_3a.Adapters.FiltrosMapaAdapter;
import com.example.serpumar.sprint0_3a.ClasesPojo.FiltrosMapaPojo;
import com.example.serpumar.sprint0_3a.MainActivity;
import com.example.serpumar.sprint0_3a.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import butterknife.internal.DebouncingOnClickListener;

public class MapaFragment_filtros extends Fragment {


        LinearLayout linearLayout;

        Button applyFiltersButton;

        TextView textviewReset;

        ExpandableListView expandablelistviewFilter;

        FragmentActivity mContext;
        List<FiltrosMapaPojo> listDataHeader;
        HashMap<String, List<String>> listDataChild;

        FiltrosMapaAdapter listAdapter;

        private OnFragmentInteractionListener mListener;

    public MapaFragment_filtros() { }


        public static MapaFragment_filtros newInstance() {
            MapaFragment_filtros fragment = new MapaFragment_filtros();
            Bundle args = new Bundle();

            fragment.setArguments(args);
            return fragment;
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
            listDataHeader = new ArrayList<FiltrosMapaPojo>();
            listDataChild = new HashMap<>();
            // Adding child data
            listDataHeader.add(new FiltrosMapaPojo("Gases", "All sizes"));
            listDataHeader.add(new FiltrosMapaPojo("Item Color", "Select"));
            listDataHeader.add(new FiltrosMapaPojo("Sort", "Select"));


// Adding child data
            List<String> bySize = new ArrayList<>();
            bySize.add("O3");
            bySize.add("SO2");
            bySize.add("CO");


            List<String> color = new ArrayList<>();
            color.add("Black");
            color.add("Red");
            color.add("White");
            color.add("Green");
            color.add("Blue");

            List<String> sort = new ArrayList<>();
            sort.add("Cost ($): highest first");
            sort.add("Cost ($): lowest first");


            listDataChild.put(listDataHeader.get(0).getTitle(), bySize); // Header, Child data
            listDataChild.put(listDataHeader.get(1).getTitle(), color);
            listDataChild.put(listDataHeader.get(2).getTitle(), sort);

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
            androidx.fragment.app.FragmentManager fragmentManager = getFragmentManager();
            fragmentManager.popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);
            fragmentManager.popBackStackImmediate();
        }

}
