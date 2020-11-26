package com.example.serpumar.sprint0_3a.Fragments;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import com.example.serpumar.sprint0_3a.R;

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
        wv.loadUrl("https://igmagi.upv.edu.es/medicionesOficialesCSV");
        return v;
    }
}