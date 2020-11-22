package com.example.serpumar.sprint0_3a.Adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.serpumar.sprint0_3a.LoginActivity;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.ClasesPojo.RecompensasPojo;

import java.util.ArrayList;

public class RecompensasAdapter extends RecyclerView.Adapter<RecompensasAdapter.RecompensasViewHolder> {

    ArrayList<RecompensasPojo> listaRecompensas;
    Context context;

    public RecompensasAdapter(ArrayList<RecompensasPojo> listaRecompensas, Context context) {
        this.listaRecompensas = listaRecompensas;
        this.context = context;
    }

    @Override
    public  RecompensasViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_list,null, false);
        return new RecompensasViewHolder(view);
    }

    @Override
    public void onBindViewHolder(RecompensasViewHolder holder, final int position) {
        holder.txtRecompensa.setText(listaRecompensas.get(position).getRecompensa());
        holder.txtInfo.setText(listaRecompensas.get(position).getInfo());
        holder.imagen.setImageResource(listaRecompensas.get(position).getImageId());

        holder.canjearButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                canjearRecompensa(position);
            }
        });
    }

    private void canjearRecompensa(int pos){

        Intent i = new Intent(context, LoginActivity.class);
        //startActivity(i);
    }

    @Override
    public int getItemCount() {
        return listaRecompensas.size();
    }

    public class  RecompensasViewHolder extends RecyclerView.ViewHolder {

        TextView txtRecompensa;
        TextView txtInfo;
        ImageView imagen;
        Button canjearButton;

        public RecompensasViewHolder(View itemView) {

            super(itemView);
            txtRecompensa = itemView.findViewById(R.id.idRecompensa);
            txtInfo = itemView.findViewById(R.id.idInfo);
            imagen = itemView.findViewById(R.id.idImagen);
            canjearButton = itemView.findViewById(R.id.CanjearButton);
        }
    }
}
