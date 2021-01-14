package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.airbnb.lottie.LottieAnimationView;
import com.example.serpumar.sprint0_3a.Activities.Main.Adapters.RecompensasAdapter;
import com.example.serpumar.sprint0_3a.Activities.Main.MainActivity;
import com.example.serpumar.sprint0_3a.Models.Recompensa;
import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.Models.Usuario;
import com.example.serpumar.sprint0_3a.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import static java.lang.Integer.parseInt;

public class RecompensasFragment extends Fragment implements RecompensasAdapter.OnRecompensaListener {

    RecyclerView recyclerRecompensas;
    ArrayList<Recompensa> listaRecompensas;
    LottieAnimationView lottieAnimationView3Bar;
    TextView puntosUsuario;
    Account[] accounts;
//    final AccountManager accountManager = AccountManager.get(getActivity());

    public RecompensasFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_recompensas, container, false);

        listaRecompensas = new ArrayList<>();
        recyclerRecompensas = view.findViewById(R.id.recyclerId);
        recyclerRecompensas.setLayoutManager(new LinearLayoutManager(getContext()));
        //lottieAnimationView3Bar = view.findViewById(R.id.animationViewBar);
        puntosUsuario = view.findViewById(R.id.puntosUsuarios);

        Usuario usuario = ((MainActivity)getActivity()).getUsuario();

        if(((MainActivity)getActivity()).isLogged()){
            puntosUsuario.setText(String.valueOf(usuario.getPuntosCanjeables()));
            //lottieAnimationView3Bar.setVisibility(View.VISIBLE);
        }else{
            puntosUsuario.setText("Debes estar logueado");
            //lottieAnimationView3Bar.setVisibility(View.INVISIBLE);
        }


        llenarLista();

        return view;
    }

    private void llenarLista() {
        final RecompensasAdapter.OnRecompensaListener onRecompensaListener = this;

        //Obtener recompensas y añadirlas a la lista
        NetworkManager.getInstance().getRequest("/recompensas", new NetworkManager.ControladorRespuestas<String>() {
            @Override
            public void getResult(String object) {
                try {
                    JSONArray jsonArray = new JSONArray(object);
                    for (int i = 0; i < jsonArray.length(); i++) {

                        JSONObject recompensa = jsonArray.getJSONObject(i);
                        Log.i("AAAA", recompensa.getString("titulo"));
                        switch (recompensa.getString("titulo")) {

                            case "Cine":
                                listaRecompensas.add(new Recompensa(recompensa.getInt("id"), recompensa.getString("titulo"), recompensa.getString("descripcion"), recompensa.getInt("coste"), R.drawable.ic_baseline_local_movies_24));
                                break;
                            case "Cena":
                                listaRecompensas.add(new Recompensa(recompensa.getInt("id"), recompensa.getString("titulo"), recompensa.getString("descripcion"), recompensa.getInt("coste"), R.drawable.ic_baseline_fastfood_24));
                                break;
                            case "Bici":
                                listaRecompensas.add(new Recompensa(recompensa.getInt("id"), recompensa.getString("titulo"), recompensa.getString("descripcion"), recompensa.getInt("coste"), R.drawable.ic_baseline_pedal_bike_24));
                                break;
                            case "Pistas":
                                listaRecompensas.add(new Recompensa(recompensa.getInt("id"), recompensa.getString("titulo"), recompensa.getString("descripcion"), recompensa.getInt("coste"), R.drawable.ic_baseline_sports_tennis_24));
                                break;
                            case "Cursillos":
                                listaRecompensas.add(new Recompensa(recompensa.getInt("id"), recompensa.getString("titulo"), recompensa.getString("descripcion"), recompensa.getInt("coste"), R.drawable.ic_baseline_school_24));
                                break;

                            default:
                                listaRecompensas.add(new Recompensa(recompensa.getInt("id"), recompensa.getString("titulo"), recompensa.getString("descripcion"), recompensa.getInt("coste"), R.drawable.ic_baseline_stars_24));
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                Log.i("AAAA", listaRecompensas.size() + "");

                RecompensasAdapter adapter = new RecompensasAdapter(listaRecompensas, getContext(), onRecompensaListener);
                recyclerRecompensas.setAdapter(adapter);
            }
        });
    }



    @Override
    public void onRecompensaClick(int posicion, final Button button) {
        //Log.d("TAG", "onRecompensaClick: clicked ");
        //TODO hacer que aparezca un texto para poder copiar
        if (!button.isShown()) {
            button.setVisibility(View.VISIBLE);
        } else {
            button.setVisibility(View.GONE);
        }


    }
}