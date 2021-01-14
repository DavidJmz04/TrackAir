    package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

    import android.accounts.Account;
    import android.accounts.AccountManager;
    import android.content.Intent;
    import android.os.Bundle;
    import android.view.LayoutInflater;
    import android.view.View;
    import android.view.ViewGroup;
    import android.widget.Button;
    import android.widget.LinearLayout;
    import android.widget.TextView;

    import androidx.constraintlayout.widget.ConstraintLayout;
    import androidx.fragment.app.Fragment;

    import com.anychart.AnyChartView;
    import com.anychart.core.Chart;
    import com.example.serpumar.sprint0_3a.Activities.Login.LoginActivity;
    import com.example.serpumar.sprint0_3a.Activities.Main.MainActivity;
    import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
    import com.example.serpumar.sprint0_3a.Models.ReceptorBluetooth;
    import com.example.serpumar.sprint0_3a.Models.Usuario;
    import com.example.serpumar.sprint0_3a.R;

    import org.json.JSONArray;
    import org.json.JSONException;
    import org.json.JSONObject;

    import com.example.serpumar.sprint0_3a.Helpers.ChartUtils;

    public class PerfilFragment extends Fragment {

    public PerfilFragment() { }

    //Esta per pulir i optimitzar
    Account[] accounts;
    String CLASS_NAME = "PerfilFragment";
    View v;
    ReceptorBluetooth rb;
        ConstraintLayout chartCalidad;
        boolean flag = false;
        AnyChartView anyChartView;


        @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        v = inflater.inflate(R.layout.fragment_perfil, container, false);

        LinearLayout perfilLayout = v.findViewById(R.id.Perfil);
        ConstraintLayout iniciarSesionLayout = v.findViewById(R.id.IniciarSesion);
        Button iniciarSesionBtn = v.findViewById(R.id.boton_login);
        Button cerrarSesionBtn = v.findViewById(R.id.boton_logout);
        LinearLayout encontrarDispositivo = v.findViewById(R.id.item_dispositivo);

        final TextView nombre = v.findViewById(R.id.nombre_perfil);
        final TextView nombreUsuario = v.findViewById(R.id.usuario_perfil);
        final TextView reputacion = v.findViewById(R.id.puntuacion_perfil);
        final LinearLayout calidadField = v.findViewById(R.id.item_calidad);
        final TextView calidadAire = v.findViewById(R.id.calidad_aire);
        final TextView calidadAireFlecha = v.findViewById(R.id.calidad_aire_arrow);

        anyChartView = v.findViewById(R.id.any_chart_view);
        chartCalidad = v.findViewById(R.id.chartCalidad);

        final TextView email = v.findViewById(R.id.correo_perfil);
        final TextView telefono = v.findViewById(R.id.telefono_perfil);

        final Intent mainIntent = new Intent(getContext(), MainActivity.class);
        final Intent loginIntent = new Intent(getContext(), LoginActivity.class);

        final AccountManager accountManager = AccountManager.get(getActivity());

        // Inflate the layout for this fragment
        if (((MainActivity)getActivity()).isLogged()) {
            perfilLayout.setVisibility(View.VISIBLE);
            iniciarSesionLayout.setVisibility(View.INVISIBLE);
            //nombre.setText(accountManager.getAccounts()[0].name);
            cerrarSesionBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    accounts = accountManager.getAccounts();
                    accountManager.removeAccountExplicitly(accounts[0]);
                    startActivity(mainIntent);

                }
            });

            rb = ((MainActivity)getActivity()).getReceptorBluetooth();

            NetworkManager networkManager = NetworkManager.getInstance();

            encontrarDispositivo.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    //rb.setDistanciaEstimada(new Random(System.currentTimeMillis()).nextInt(3));
                    int distancia = rb.getDistanciaEstimada();
                    String content = "";
                    if(distancia != -1) {
                        content = (String.valueOf(rb.getDistanciaEstimada()) + " m.");
                    } else {
                        content = ("Antes debes tomar una medición");
                    }
                    ((MainActivity)getActivity()).mostrarToast("Distancia", content);
                }
            });

            Usuario usuario = ((MainActivity)getActivity()).getUsuario();
            try {
                email.setText(usuario.getCorreo());
                reputacion.setText("Puntos: " + String.valueOf(usuario.getPuntosCanjeables()));
                nombreUsuario.setText("@" + usuario.getNombreUsuario());
                nombre.setText(usuario.getNombreCompleto());
                telefono.setText(String.valueOf(usuario.getTelefono()));
                networkManager.getRequest("/calidadAire/" + usuario.getId(), new NetworkManager.ControladorRespuestas<String>() {
                    @Override
                    public void getResult(String object) {
                        try {
                            JSONArray jsonArray = new JSONArray(object);
                            final JSONObject calidad = jsonArray.getJSONObject(0);
                            calidadAire.setText("Tu calidad del aire: " +  calidad.get("calidadMedia"));
                            calidadAireFlecha.setVisibility(View.VISIBLE);
                            try{
                                anyChartView.setProgressBar(v.findViewById(R.id.progress_bar));
                                anyChartView = ChartUtils.cargarGrafico(anyChartView, calidad.getJSONArray("mediciones"));
                            } catch (Exception e){

                            }
                            calidadField.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    if(flag){
                                        chartCalidad.setVisibility(View.GONE);
                                        calidadAireFlecha.setText("v");
                                        flag = false;
                                    } else {
                                        chartCalidad.setVisibility(View.VISIBLE);
                                        calidadAireFlecha.setText("^");
                                        flag = true;
                                    }
                                }
                            });
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }catch (Exception e){
                accounts = accountManager.getAccounts();
                accountManager.removeAccountExplicitly(accounts[0]);
                startActivity(mainIntent);
            }
        } else {
            iniciarSesionLayout.setVisibility(View.VISIBLE);
            perfilLayout.setVisibility(View.INVISIBLE);

            iniciarSesionBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    startActivity(loginIntent);
                }
            });
        }

        return v;
    }



}