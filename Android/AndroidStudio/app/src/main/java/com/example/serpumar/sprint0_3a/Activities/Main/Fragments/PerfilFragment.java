    package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.app.NotificationCompat;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.anychart.AnyChart;
import com.anychart.AnyChartView;
import com.anychart.chart.common.dataentry.DataEntry;
import com.anychart.chart.common.dataentry.ValueDataEntry;
import com.anychart.charts.Cartesian;
import com.anychart.core.cartesian.series.Column;
import com.anychart.core.cartesian.series.Line;
import com.anychart.enums.Anchor;
import com.anychart.enums.HoverMode;
import com.anychart.enums.Position;
import com.anychart.enums.TooltipPositionMode;
import com.anychart.graphics.vector.Fill;
import com.anychart.graphics.vector.GradientKey;
import com.example.serpumar.sprint0_3a.Models.Usuario;
import com.example.serpumar.sprint0_3a.Activities.Login.LoginActivity;
import com.example.serpumar.sprint0_3a.Activities.Main.MainActivity;
import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.Models.ReceptorBluetooth;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static java.lang.Integer.parseInt;

    public class PerfilFragment extends Fragment {

    public PerfilFragment() { }

    //Esta per pulir i optimitzar
    Account[] accounts;
    String CLASS_NAME = "PerfilFragment";
    View v;
    ReceptorBluetooth rb;
        ConstraintLayout chartParent;
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

        final Button calidadBtn = v.findViewById(R.id.calidadBtn);

        anyChartView = v.findViewById(R.id.any_chart_view);
        chartParent = v.findViewById(R.id.chartParent);

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
            }catch (Exception e){
                email.setText("Cargando correo...");
                reputacion.setText("Puntos: " + String.valueOf(usuario.getPuntosCanjeables()));
                nombreUsuario.setText("@" + usuario.getNombreUsuario());
                nombre.setText(usuario.getNombreCompleto());
                telefono.setText(String.valueOf(usuario.getTelefono()));
            }

            cargarGrafico();
            calidadBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(flag){
                        anyChartView.animate().alpha(1f).setDuration(1000).setListener(new AnimatorListenerAdapter() {
                            @Override
                            public void onAnimationEnd(Animator animation) {
                                super.onAnimationEnd(animation);
                            }
                        });
                        chartParent.setVisibility(View.VISIBLE);
                        Log.d("TAG", "onClick: `we fucked");
                        flag = false;
                    }else{
                        anyChartView.animate().alpha(0f).setDuration(1000).setListener(new AnimatorListenerAdapter() {
                            @Override
                            public void onAnimationEnd(Animator animation) {
                                super.onAnimationEnd(animation);
                                chartParent.setVisibility(View.GONE);
                                Log.d("TAG", "onAnimationEnd: we alredy");
                                flag = true;
                            }
                        });
                    }
                }
            });
            /*
            rootScrollView = v.findViewById(R.id.scroll);
            rootScrollView.getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
                @Override
                public void onScrollChanged() {
                    int scrollY = rootScrollView.getScrollY(); // For ScrollView
                    int scrollX = rootScrollView.getScrollX(); // For HorizontalScrollView
                    if(scrollY > 50){
                        anyChartView.animate().alpha(0f).setDuration(500);
                        v.findViewById(R.id.chartParent).setVisibility(View.GONE);
                        Log.wtf("TAG", "onScrollChanged: " + scrollX + " - " + scrollY);
                    }
                    else {
                        anyChartView.animate().alpha(1f).setDuration(500);
                        v.findViewById(R.id.chartParent).setVisibility(View.VISIBLE);
                    }
                    // DO SOMETHING WITH THE SCROLL COORDINATES
                }
            });

             */
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

    public void cargarGrafico(){
        anyChartView.setProgressBar(v.findViewById(R.id.progress_bar));

        Cartesian cartesian = AnyChart.line();


        List<DataEntry> data = new ArrayList<>();
        data.add(new ValueDataEntry("10:00", 80540));
        data.add(new ValueDataEntry("11:00", 94190));
        data.add(new ValueDataEntry("12:00", 102610));
        data.add(new ValueDataEntry("13:00", 110430));
        data.add(new ValueDataEntry("14:00", 128000));
        data.add(new ValueDataEntry("15:00", 143760));
        data.add(new ValueDataEntry("16:00", 170670));
        data.add(new ValueDataEntry("17:00", 213210));
        data.add(new ValueDataEntry("22:00", 249980));

        Line column = cartesian.line(data);

        column.tooltip()
                .titleFormat("{%X}")
                .position(Position.CENTER_BOTTOM)
                .anchor(Anchor.CENTER_BOTTOM)
                .offsetX(0d)
                .offsetY(5d)
                .format("{%Value}{groupsSeparator: }");

        column.color("#1ddba6");

        cartesian.animation(true);
        cartesian.title("Calidad del aire");

        cartesian.yScale().minimum(0d);

        cartesian.yAxis(0).labels().format("${%Value}{groupsSeparator: }");

        cartesian.tooltip().positionMode(TooltipPositionMode.POINT);
        cartesian.interactivity().hoverMode(HoverMode.BY_X);

        cartesian.xAxis(0).title("Calidad");
        cartesian.yAxis(0).title("Hora");

        anyChartView.setChart(cartesian);
    }

}