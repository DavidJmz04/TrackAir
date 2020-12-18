package com.example.serpumar.sprint0_3a.Activities.Main.Adapters;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.accounts.AccountManager;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.recyclerview.widget.RecyclerView;

import com.example.serpumar.sprint0_3a.Activities.Main.MainActivity;
import com.example.serpumar.sprint0_3a.Models.Usuario;
import com.example.serpumar.sprint0_3a.Helpers.MailTask;
import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.Models.Recompensa;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.BreakIterator;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static java.lang.Integer.parseInt;

public class RecompensasAdapter extends RecyclerView.Adapter<RecompensasAdapter.RecompensasViewHolder> {

    ArrayList<Recompensa> listaRecompensas;
    Context context;
    private OnRecompensaListener mOnRecompensaListener;
    public boolean isLogged = false;
    int idUsuario;

    public RecompensasAdapter(ArrayList<Recompensa> listaRecompensas, Context context, OnRecompensaListener onRecompensaListener) {
        this.listaRecompensas = listaRecompensas;
        this.context = context;
        this.mOnRecompensaListener = onRecompensaListener;
    }

    @Override
    public  RecompensasViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_list,null, false);

        try {
            AccountManager accountManager = AccountManager.get(context);
            idUsuario = parseInt(accountManager.getUserData(accountManager.getAccountsByType("com.example.serpumar.sprint0_3a")[0], "id"));
            isLogged = true;
        }catch(Exception e){
            isLogged = false;
        }

        return new RecompensasViewHolder(view, mOnRecompensaListener);
    }

    @Override
    public void onBindViewHolder(final RecompensasViewHolder holder, final int position) {

        holder.txtRecompensa.setText(listaRecompensas.get(position).getTitulo() );
        holder.textCoste.setText(listaRecompensas.get(position).getCoste() + " puntos");
        holder.txtInfo.setText(listaRecompensas.get(position).getDescripcion());
        holder.imagen.setImageResource(listaRecompensas.get(position).getImageId());

        holder.canjearButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                obtenerPuntos(position, holder.canjearButton, holder.codigo);
            }
        });
    }

    private void obtenerPuntos(final int position, final Button button, final TextView codigoText){
        NetworkManager.getInstance().getRequest("/usuario/" + idUsuario, new NetworkManager.ControladorRespuestas<String>() {
            @Override
            public void getResult(String object) {

                try {

                    JSONArray jsonArray = new JSONArray(object);
                    JSONObject usuarioJSON = jsonArray.getJSONObject(0);

                    Usuario usuario = new Usuario(usuarioJSON.getInt("id"), usuarioJSON.getString("nombre"), usuarioJSON.getString("nombre_usuario"), usuarioJSON.getString("contrasenya"), usuarioJSON.getString("correo"), usuarioJSON.getInt("puntuacion"), usuarioJSON.getInt("puntos_canjeables"), usuarioJSON.getString("telefono"), usuarioJSON.getString("id_nodo"));

                    if (usuario.getPuntosCanjeables() >= listaRecompensas.get(position).getCoste()) {

                        canjearCodigo(position, usuario.getCorreo(), button, codigoText);
                        usuario.setPuntosCanjeables(usuario.getPuntosCanjeables() - listaRecompensas.get(position).getCoste());

                        editarUsuario(usuario);

                    } else Toast.makeText(context, "No tienes suficientes puntos", Toast.LENGTH_LONG).show();

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void canjearCodigo(final int position, final String correo, final Button button, final TextView codigoText){

        NetworkManager.getInstance().getRequest("/codigoRecompensa/" + listaRecompensas.get(position).getId(), new NetworkManager.ControladorRespuestas<String>() {
            @Override
            public void getResult(String object) {

                try {
                    JSONArray jsonArray= new JSONArray(object);
                    String codigo= jsonArray.getJSONObject(0).getString("codigo");
                    //button.setText(codigo);
                    codigoText.setText(codigo);
                    codigoText.setVisibility(View.VISIBLE);
                    (codigoText.getCompoundDrawables())[0].setTint(context.getResources().getColor(android.R.color.black));
                    button.setEnabled(false);

                    MailTask sm = new MailTask(context, correo, listaRecompensas.get(position).getTitulo(), "Su codigo de la recompensa canjeada es: " + codigo);
                    sm.execute();

                } catch (JSONException e) {

                    Toast.makeText(context, "En este momento no disponemos de códigos", Toast.LENGTH_LONG).show();
                    e.printStackTrace();
                }
            }
        });
    }

    private void editarUsuario(Usuario usuario) {

        Map<String, String> parametros = new HashMap<>();
        parametros.put("id", String.valueOf(usuario.getId()));
        parametros.put("nombreCompleto", usuario.getNombreCompleto());
        parametros.put("nombreUsuario", usuario.getNombreUsuario());
        parametros.put("contrasenya", usuario.getContrasenya());
        parametros.put("correo", usuario.getCorreo());
        parametros.put("puntuacion", String.valueOf(usuario.getPuntuacion()));
        parametros.put("telefono", usuario.getTelefono());
        parametros.put("idNodo", usuario.getIdNodo());
        parametros.put("puntosCanjeables", String.valueOf(usuario.getPuntosCanjeables()));

        JSONObject jsonParametros = new JSONObject(parametros);
        Log.d("fffff", jsonParametros.toString());


        NetworkManager.getInstance().putRequest(jsonParametros, "/editarUsuario", new NetworkManager.ControladorRespuestas<JSONObject>() {
            @Override
            public void getResult(JSONObject object) {

            }
        });
    }

    @Override
    public int getItemCount() {
        return listaRecompensas.size();
    }

    public class  RecompensasViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

        TextView textCoste;
        TextView txtRecompensa;
        TextView txtInfo;
        ImageView imagen;
        Button canjearButton;
        TextView codigo;
        OnRecompensaListener onRecompensaListener;

        public RecompensasViewHolder(View itemView, OnRecompensaListener onRecompensaListener) {

            super(itemView);
            txtRecompensa = itemView.findViewById(R.id.idRecompensa);
            textCoste = itemView.findViewById(R.id.idCoste);
            txtInfo = itemView.findViewById(R.id.idInfo);
            imagen = itemView.findViewById(R.id.idImagen);
            canjearButton = itemView.findViewById(R.id.CanjearButton);
            codigo = itemView.findViewById(R.id.CopiarCodigo);
            if(!isLogged){
                codigo.setVisibility(View.GONE);
                canjearButton.setVisibility(View.GONE);
            }
            codigo.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
                    ClipData clip = ClipData.newPlainText(codigo.getText(), codigo.getText());
                    clipboard.setPrimaryClip(clip);
                    Toast.makeText(context, "Codigo copiado", Toast.LENGTH_SHORT).show();
                }
            });
            this.onRecompensaListener = onRecompensaListener;

            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            if (isLogged)
            onRecompensaListener.onRecompensaClick(getAdapterPosition(), canjearButton);
        }
    }

    public interface OnRecompensaListener {
        void onRecompensaClick(int posicion, final Button button);
    }
}
