package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RawRes;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import com.example.serpumar.sprint0_3a.Activities.Main.Adapters.FiltrosMapaAdapter;
import com.example.serpumar.sprint0_3a.Activities.Main.MainActivity;
import com.example.serpumar.sprint0_3a.Helpers.GPSService;
import com.example.serpumar.sprint0_3a.Helpers.LogicaFake;
import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.Models.Ubicacion;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.Models.ReceptorBluetooth;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.maps.model.TileProvider;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.maps.android.heatmaps.Gradient;
import com.google.maps.android.heatmaps.HeatmapTileProvider;
import com.google.maps.android.heatmaps.WeightedLatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.security.cert.LDAPCertStoreParameters;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.Scanner;


public class MapaFragment extends Fragment implements OnMapReadyCallback {

    private static String ETIQUETA_LOG = "MapaFragment";

    private GPSService gpsService = new GPSService();
    public LogicaFake lf;

    private FragmentActivity myContext;

    FragmentTransaction transaction;
    Fragment fragment;

    private MapView mapView;

    private GoogleMap mMap;

    private HashMap hashGases;

    SharedPreferences pref; // 0 - for private mode
    SharedPreferences.Editor editor;


    /*Cargar de primeras en el mapa aquello que este marcado en los filtros --> Primeras opciones de cada uno*/

    public MapaFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        final View view = inflater.inflate(R.layout.fragment_map_, container, false);
        fragment = new MapaFragment_filtros(this);

        if (mMap != null) {
            Log.d("Recargar", "Recargar");
            mMap.clear();
        }

        /*FloatingActionButton abrirInformacionAdicional = (FloatingActionButton) view.findViewById(R.id.informacionFAB);
        abrirInformacionAdicional.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.container, new MedicionesFragment()).commit();
            }
        });*/

        Button abrirFiltro = (Button) view.findViewById(R.id.botonMapa);
        abrirFiltro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showFragment();

            }
        });

        pref = getActivity().getSharedPreferences("MyPref", 0); // 0 - for private mode
        editor = pref.edit();

        //valoresQueSeCarganEnMapa();

        return view;

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mapView = (MapView) view.findViewById(R.id.map);
        mapView.onCreate(savedInstanceState);
        mapView.onResume();
        mapView.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {

        mMap = googleMap;

        mMap.setMinZoomPreference(10.0f);
        mMap.setMaxZoomPreference(15.0f);

        Ubicacion ub = new Ubicacion(38.993115, -0.166975);
        LatLng ubActual = new LatLng(ub.getLatitud(), ub.getLongitud());
        //mMap.addMarker(new MarkerOptions().position(ubActual));
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(ubActual, 15.0f));
        //mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(ubActual, 12.0f));

        cargarMapaDeCalor();
        //addHeatMap();
    }

    private void showFragment() {
        transaction = getActivity().getSupportFragmentManager().beginTransaction();
        if (!fragment.isAdded()) {
            transaction.add(R.id.frame, fragment, "filter");
        }
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void addHeatMap(JSONArray jarray) {
        List<WeightedLatLng> WlatLngs = null;
        // Get the data: latitude/longitude positions of police stations.
        /*try {
            WlatLngs = readItems(jsonPrueba());
        } catch (JSONException e) {
            Toast.makeText(myContext, "Problem reading list of locations.", Toast.LENGTH_LONG).show();
        }
        */
        Log.d("Cre", "addHeatMap: " + jarray.length());
        if (jarray != null && jarray.length() > 0) {
            try {
                WlatLngs = readItems(jarray);
                int[] colors = { //Rojo encima limite amarillo verde
                        Color.rgb(0, 255, 0), // Verde
                        Color.rgb(255, 255, 0), // Amarrillo
                        Color.rgb(255, 0, 0)    // Rojo
                };
                float[] startPoints = {
                        0.33f, 0.67f, 1f
                };
                Gradient grd = new Gradient(colors, startPoints, 200);
                // Create a heat map tile provider, passing it the latlngs of the police stations.
                HeatmapTileProvider provider = new HeatmapTileProvider.Builder().weightedData(WlatLngs).gradient(grd)/*gradient(establecerGradiente(WlatLngs.get(i).getIntensity())).*/.build();
                //provider.setOpacity(0.7);
                provider.setRadius(30);
                provider.setMaxIntensity(500);


                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(jarray.getJSONObject(0).getDouble("lat"), jarray.getJSONObject(0).getDouble("lon")), 15.0f));

                //provider.setMaxDrawing
                // Add a tile overlay to the map, using the heat map tile provider.
                TileOverlay overlay = mMap.addTileOverlay(new TileOverlayOptions().tileProvider(provider));
                overlay.clearTileCache();

            } catch (JSONException e) {
                Log.e("Error JSON", e.toString());
            }
        } else if (jarray == null){
            Toast.makeText(getContext(), "No hay valores del Gas seleccionado", Toast.LENGTH_SHORT).show();
            Log.d("+++", "addHeatMap: Null");
        } else if (jarray.length() == 0) {
            Toast.makeText(getContext(), "No hay valores del Gas seleccionado", Toast.LENGTH_SHORT).show();
            Log.d("+++", "addHeatMap: Tamanyo 0");
        }


    }

    private List<WeightedLatLng> readItems(JSONArray array) throws JSONException {
        List<WeightedLatLng> result = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            JSONObject object = array.getJSONObject(i);
            double weigth = object.getDouble("value");
            double lat = object.getDouble("lat");
            double lng = object.getDouble("lon");
            result.add(new WeightedLatLng(new LatLng(lat, lng), weigth));
            Log.wtf("TAG", weigth + " w");
        }
        return result;
    }

    private JSONArray jsonPrueba() {
        JSONArray jarray = new JSONArray();
        Random r = new Random();
        for (int i = 0; i < 500; i++) {
            try {
                JSONObject obj = new JSONObject();
                obj.put("weight", (1 + (150) * r.nextDouble()));
                obj.put("lat", (38.869172 + (39.018634 - 38.869172) * r.nextDouble()));
                obj.put("lng", (-0.245314 + (-0.137187 - -0.245314) * r.nextDouble()));
                jarray.put(obj);
            } catch (JSONException e) {

            }

        }
        return jarray;
    }

    private void cargarMapaDeCalor() {
        String radioButtonChecked = pref.getString("radioButtonString", "");

        if (radioButtonChecked.length() > 0) {

            String[] radioButtonInfo = radioButtonChecked.split(";");
            if (Integer.parseInt(radioButtonInfo[1]) == 0) {
                cargarValoresDeServidor("GI"); // <JSONObject> listaIrritante = new ArrayList<>();
                //jsonArray = lo que devuelve llamada al servidor GI
                Log.d("Gas", radioButtonInfo[1] + "GI");
            } else if (Integer.parseInt(radioButtonInfo[1]) == 1) {
                cargarValoresDeServidor("CO2"); // <JSONObject> listaIrritante = new ArrayList<>();
                //jsonArray = lo que devuelve llamada al servidor CO2
                Log.d("Gas", radioButtonInfo[1] + "CO2");
            } else if (Integer.parseInt(radioButtonInfo[1]) == 2) {
                cargarValoresDeServidor("NO2"); // <JSONObject> listaIrritante = new ArrayList<>();
                //jsonArray = lo que devuelve llamada al servidor NO2
                Log.d("Gas", radioButtonInfo[1] + "NO2");
            } else if (Integer.parseInt(radioButtonInfo[1]) == 3) {
                cargarValoresDeServidor("O3"); // <JSONObject> listaIrritante = new ArrayList<>();
                //jsonArray = lo que devuelve llamada al servidor O3
                Log.d("Gas", radioButtonInfo[1] + "O3");
            } else if (Integer.parseInt(radioButtonInfo[1]) == 4) {
                cargarValoresDeServidor("SO2"); // <JSONObject> listaIrritante = new ArrayList<>();
                //jsonArray = lo que devuelve llamada al servidor SO2
                Log.d("Gas", radioButtonInfo[1] + "SO2");
            }


        }
    }

    private void cargarValoresDeServidor(String gas) {
        NetworkManager.getInstance().getRequest("/lecturas/" + gas, new NetworkManager.ControladorRespuestas<String>() {
            @Override
            public void getResult(String object) {
                try {
                    addHeatMap(new JSONArray(object));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

        });
    }

    public void reloadFragment() {
        if (mMap != null) {
            Log.d("Recargar", "Recargar");
            mMap.clear();
            cargarMapaDeCalor();
        }
    }

    private Gradient establecerGradiente(double valor) { //0-50 verde 51-100 amarillo 101-150 rojo

        double porc_verde = 0;
        double porc_amarillo = 0;
        double porc_rojo = 0;

        if (valor > 50) {
            if (valor > 100) {
                porc_verde = 50 / valor;
                porc_amarillo = 50 / valor;
                porc_rojo = 1 - (porc_verde + porc_amarillo);
            } else {
                porc_verde = 50 / valor;
                porc_amarillo = 1 - porc_verde;
            }
        } else {
            porc_verde = 1;
        }

        int[] colors = { //Rojo encima limite amarillo verde
                Color.rgb(0, 255, 0), // Verde
                Color.rgb(255, 255, 0), // Amarrillo
                Color.rgb(255, 0, 0)    // Rojo
        };

        Log.d("Colores", "Valor " + valor);
        Log.d("Colores", "" + porc_rojo + " " + porc_amarillo + " " + porc_verde);

        float[] startPoints = {
                (float) porc_rojo - 0.02f, (float) porc_amarillo - 0.01f, (float) porc_verde
        };

        return new Gradient(colors, startPoints);


    }


}