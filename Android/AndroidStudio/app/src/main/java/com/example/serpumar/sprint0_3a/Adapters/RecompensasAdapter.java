package com.example.serpumar.sprint0_3a.Adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.ClasesPojo.RecompensasPojo;

import java.util.ArrayList;

public class RecompensasAdapter extends RecyclerView.Adapter<RecompensasAdapter.RecompensasViewHolder> {

    ArrayList<RecompensasPojo> listaRecompensas;

    public RecompensasAdapter(ArrayList<RecompensasPojo> listaRecompensas) {
        this.listaRecompensas = listaRecompensas;
    }

    @Override
    public  RecompensasViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_list,null, false);
        return new RecompensasViewHolder(view);
    }

    @Override
    public void onBindViewHolder(RecompensasViewHolder holder, int position) {
        holder.txtRecompensa.setText(listaRecompensas.get(position).getRecompensa());
        holder.txtInfo.setText(listaRecompensas.get(position).getInfo());
        holder.imagen.setImageResource(listaRecompensas.get(position).getImageId());
    }

    @Override
    public int getItemCount() {
        return listaRecompensas.size();
    }

    public class  RecompensasViewHolder extends RecyclerView.ViewHolder {
        TextView txtRecompensa;
        TextView txtInfo;
        ImageView imagen;

        public RecompensasViewHolder(View itemView) {
            super(itemView);
            txtRecompensa = itemView.findViewById(R.id.idRecompensa);
            txtInfo = itemView.findViewById(R.id.idInfo);
            imagen = itemView.findViewById(R.id.idImagen);

            //Codigo oculto??

        }
    }
}
