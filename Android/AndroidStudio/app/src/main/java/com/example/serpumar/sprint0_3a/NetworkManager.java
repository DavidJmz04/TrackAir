package com.example.serpumar.sprint0_3a;

import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.JsonRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

public class NetworkManager {
    private static final String TAG = "NetworkManager";
    private static NetworkManager instance = null;

    private String url = "http://igmagi.upv.edu.es"; //Ip Zona Wifi telefono móvil -- SI SE CAMBIA AQUI, en el network_secutiry_config.xml tambien

    //for Volley API
    public RequestQueue requestQueue;

    private NetworkManager(Context context) {
        requestQueue = Volley.newRequestQueue(context.getApplicationContext());
        //other stuf if you need
    }

    public static synchronized NetworkManager getInstance(Context context) {
        if (null == instance)
            instance = new NetworkManager(context);
        return instance;
    }

    //this is so you don't need to pass context each time
    public static synchronized NetworkManager getInstance() {
        if (null == instance) {
            throw new IllegalStateException(NetworkManager.class.getSimpleName() +
                    " is not initialized, call getInstance(...) first");
        }
        return instance;
    }

    public void postRequest(JSONObject jsonParametros, String stringRequest, final ControladorRespuestas controladorRespuestas) {

        requestQueue.start();

        JsonRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url + stringRequest, jsonParametros, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Log.d("Response", "Guardado en base de datos");
                controladorRespuestas.getResult(response);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        });

        requestQueue.add(jsonObjectRequest);
    }

    public void putRequest(JSONObject jsonParametros, String stringRequest, final ControladorRespuestas controladorRespuestas) {

        requestQueue.start();

        JsonRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, url + stringRequest, jsonParametros, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Log.d("Response", "Guardado en base de datos");
                controladorRespuestas.getResult(response);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        });

        requestQueue.add(jsonObjectRequest);
    }

    public interface ControladorRespuestas<T> {
        void getResult(T object);
    }
}
