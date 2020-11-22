package com.example.serpumar.sprint0_3a;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.JsonRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.serpumar.sprint0_3a.ClasesPojo.Medicion;
import com.example.serpumar.sprint0_3a.ClasesPojo.Ubicacion;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LogicaFake {


    public int id= -1;

    private static RequestQueue requestQueue;
    private Context context;

    private String url = "http://igmagi.upv.edu.es"; //Ip Zona Wifi telefono móvil -- SI SE CAMBIA AQUI, en el network_secutiry_config.xml tambien

    public LogicaFake(Context context) {
        //Iniciamos la cola
        requestQueue = Volley.newRequestQueue(context);
        this.context = context;
    }

    // ...............................................................................
    // obtenerMediciones() <--
    // <--
    // Lista {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ...............................................................................
    public void obtenerMediciones() { //Obtener todas las mediciones de la base de datos (GET)

        // Empezamos la cola
        requestQueue.start();

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url + "/mediciones", null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Log.d("Response", response.toString());
                //TODO Devolver esto

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        }

        );
        requestQueue.add(jsonArrayRequest);
    }

    // ...............................................................................
    //id:Z
    // -->
    // obtenerMedicionesDeUsuario() <--
    // <--
    // Lista {valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // ...............................................................................
    public void obtenerMedicionesDeUsuario(int id) { //Obtener las mediciones del usuario de la base de datos (GET)

        // Empezamos la cola
        requestQueue.start();
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url + "/mediciones/" + id, null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Log.d("Response", response.toString());
                //TODO Devolver esto

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        }

        );

        requestQueue.add(jsonArrayRequest);
    }

    // ...............................................................................
    // datos:{idUsuario:Z, valor:Real, momento:Datetime, ubicacion:Texto, tipoMedicion:Texto}
    // -->
    // guardarMedicion() -->
    // ...............................................................................
    public void guardarMedicion(Medicion medicion) { //Guardar Medicion en la base de datos (POST)

        int id = 35;
        Map<String, String> parametros = new HashMap<>();
        parametros.put("valor", String.valueOf(medicion.getMedicion()));
        parametros.put("ubicacion", medicion.getUbicacion().getLatitud() + "," + medicion.getUbicacion().getLongitud());
        parametros.put("momento", medicion.getDate());
        parametros.put("tipoMedicion", medicion.getTipoMedicion());
        parametros.put("idUsuario", String.valueOf(id));

        //Json con valor y ubicacion(latitud y longitud), momento e idUsuario
        JSONObject jsonParametros = new JSONObject(parametros);

        Log.d("JSON GuardarMedicion", jsonParametros.toString());
        // Empezamos la cola
        requestQueue.start();
        JsonRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url + "/medicion", jsonParametros, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {

                Log.d("Response", "medicion guardada en base de datos");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        });

        requestQueue.add(jsonObjectRequest);
    }

    // ...............................................................................
    //id:Z
    // -->
    // obtenerTipoDeMedicion() <--
    // <--
    // {id:Z, descripcion:Texto, limite_max:R}
    // ...............................................................................
    public void obtenerTipoDeMedicion(String id) { //Obtener tipo de medicion de la base de datos (GET)

        // Empezamos la cola
        requestQueue.start();
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url + "/tipoMedicion/" + id, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Log.d("Response", response.toString());
                //TODO Devolver esto

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        }

        );

        requestQueue.add(jsonObjectRequest);
    }

    // ...............................................................................
    //id:Z
    // -->
    // obtenerUsuario() <--
    // <--
    // {id:Z, nombreUsuario:Texto, contrasenya:Texto, correo:Texto, puntuacion:Z}
    // ...............................................................................
    public void obtenerUsuario(int id) { //Obtener usuario de la base de datos (GET)

        // Empezamos la cola
        requestQueue.start();
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url + "/usuario/" + id, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                //TODO Devolver esto
                Log.d("Response", "" + response);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        }

        );

        requestQueue.add(jsonObjectRequest);
    }

    // ...............................................................................
    // datos:{nombreUsuario:Texto, contrasenya:Texto, correo:Texto, Puntuacion:Z}
    // -->
    // guardarUsuario() -->
    // ...............................................................................
    public void guardarUsuario(String nombreUsuario, String contrasenya, String correo, int puntuacion) { //Guardar usuario en la base de datos (POST)

        Map<String, String> parametros = new HashMap<>();
        parametros.put("nombreUsuario", nombreUsuario);
        parametros.put("contrasenya", contrasenya);
        parametros.put("correo", correo);
        parametros.put("puntuacion", String.valueOf(puntuacion));

        //Json con nombreUsuario, contrasenya, correo y puntuacion
        JSONObject jsonParametros = new JSONObject(parametros);

        Log.d("JSON GuardarUsuario", jsonParametros.toString());

        // Empezamos la cola
        requestQueue.start();

        JsonRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url + "/usuario", jsonParametros, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Log.d("Response", "Usuario guardado en base de datos");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        });

        requestQueue.add(jsonObjectRequest);
    }

    // ...............................................................................
    // datos:{id=Z, nombreUsuario:Texto, contrasenya=Texto, correo=Texto, puntuacion=Texto}
    // -->
    // editarUsuario() -->
    // ...............................................................................
    public void editarUsuario(int id, String nombreUsuario, String contrasenya, String correo, int puntuacion) { //Editar usuario en la base de datos (POST)

        Map<String, String> parametros = new HashMap<>();
        parametros.put("id", String.valueOf(id));
        parametros.put("nombreUsuario", nombreUsuario);
        parametros.put("contrasenya", contrasenya);
        parametros.put("correo", correo);
        parametros.put("puntuacion", String.valueOf(puntuacion));

        //Json con id, nombreUsuario, contrasenya, correo y puntuacion
        JSONObject jsonParametros = new JSONObject(parametros);

        Log.d("JSON editarUsuario", jsonParametros.toString());

        // Empezamos la cola
        requestQueue.start();

        JsonRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, url + "/editarUsuario", jsonParametros, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Log.d("Response", "Usuario modificado en base de datos");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        });

        requestQueue.add(jsonObjectRequest);
    }

    // ...............................................................................
    //datos:{nombreUsuario:Texto, contrasenya=Texto}
    // -->
    // login() <--
    // <--
    // {existe:true, id:Z || existe:false}
    // ...............................................................................
    public void login(String nombreUsuario, String contrasenya) { //Hacer el login en en la base de datos (POST)

        Map<String, String> parametros = new HashMap<>();
        parametros.put("nombreUsuario", nombreUsuario);
        parametros.put("contrasenya", contrasenya);

        //Json con nombreUsuario y contrasenya
        JSONObject jsonParametros = new JSONObject(parametros);

        Log.d("JSON login", jsonParametros.toString());

        // Empezamos la cola
        requestQueue.start();

        JsonRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url + "/login", jsonParametros, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {

                Log.d("Response", response.toString());
                //TODO: No hacerlo aqui, llamar a un callback
                try {
                    if (response.getBoolean("existe")) {

                        Activity ActivityContext = (Activity) context;
                        id= response.getInt("id");
                        Toast.makeText(context, "Te has logueado", Toast.LENGTH_LONG).show();
                        Intent intent = new Intent(context, MainActivity.class);
                        ((Activity) context).startActivity(intent);
                        ((Activity) context).finish();

                    } else
                        Toast.makeText(context, "Te has equivocado, vuelve a intentarlo", Toast.LENGTH_LONG).show();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        });
        requestQueue.add(jsonObjectRequest);
    }

    public void obtenerMedicion(final Context context) { //Obtener Medicion de la base de datos (GET)
        // Empezamos la cola
        requestQueue.start();

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url + "/mediciones", null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Log.d("Response", response.toString());
                //TODO Devolver esto
                TextView textoValores = ((Activity) context).findViewById(R.id.cajaMediciones);
                textoValores.setText(response.toString());
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        }

        );
        requestQueue.add(jsonArrayRequest);
    }

    public void obtenerMedicionesOficialesAPI(final Context context) { //Obtener Medicion de la base de datos (GET)
        // Empezamos la cola
        requestQueue.start();

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url + "/medicionesOficiales", null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Log.d("Response", response.toString());
                List<JSONObject> list = new ArrayList<JSONObject>();

                TextView textoValores = ((Activity) context).findViewById(R.id.cajaMediciones);
                textoValores.setText(response.toString());
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        }

        );
        jsonArrayRequest.setRetryPolicy(new DefaultRetryPolicy(20000, DefaultRetryPolicy.DEFAULT_MAX_RETRIES, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        requestQueue.add(jsonArrayRequest);
    }

    public void obtenerMedicionesOficialesLOCAL(final Context context) { //Obtener Medicion de la base de datos (GET)
        // Empezamos la cola
        requestQueue.start();

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url + "/medicionesOficialesCSV", null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Log.d("Response", response.toString());
                List<JSONObject> list = new ArrayList<JSONObject>();

                TextView textoValores = ((Activity) context).findViewById(R.id.cajaMediciones);
                textoValores.setText(response.toString());
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        }

        );
        requestQueue.add(jsonArrayRequest);
    }

    public final UltimaPeticion ultimaPeticion = new UltimaPeticion();

    // ...............................................................................
    // obtenerRecompensas() <--
    // <--
    // Lista {id:Texto, titulo:Texto, descripcion:Texto, coste:Z}
    // ...............................................................................
    public void obtenerRecompensas() { //Obtener todas las recompensas de la base de datos (GET)

        // Empezamos la cola
        requestQueue.start();

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url + "/mediciones", null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Log.d("Response", response.toString());
                //TODO Devolver esto
                ultimaPeticion.peticion = response.toString();
                ultimaPeticion.hayPeticion = true;
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error.Response", error.toString());
            }
        }
        );
        requestQueue.add(jsonArrayRequest);
    }

    public static class UltimaPeticion {
        public String peticion;
        public Boolean hayPeticion = false;

        public String getPeticion() {
            return peticion;
        }

        public Boolean getFlag(){
            return hayPeticion;
        }
    }

}

