// ------------------------------------------------------------------
// ------------------------------------------------------------------

package com.example.serpumar.sprint0_3a.Activities.Main;

// ------------------------------------------------------------------
// ------------------------------------------------------------------
import android.accounts.AccountManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.example.serpumar.sprint0_3a.Activities.Main.Fragments.MapaFragment;
import com.example.serpumar.sprint0_3a.Activities.Main.Fragments.PerfilFragment;
import com.example.serpumar.sprint0_3a.Activities.Main.Fragments.RecompensasFragment;
import com.example.serpumar.sprint0_3a.Helpers.NetworkManager;
import com.example.serpumar.sprint0_3a.R;
import com.example.serpumar.sprint0_3a.Models.ReceptorBluetooth;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.Random;

import static java.lang.Integer.parseInt;

// ------------------------------------------------------------------
// ------------------------------------------------------------------

public class MainActivity extends AppCompatActivity {

    private BottomNavigationView bottomNavigationView;
    ReceptorBluetooth receptorBluetooth;
    AccountManager accountManager;
    boolean isLogged;

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bottomNavigationView=findViewById(R.id.bottomNav);
        bottomNavigationView.setOnNavigationItemSelectedListener(bottomNavMethod);

        Intent notificationIntent = new Intent(this, MainActivity.class);
        notificationIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        notificationIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        notificationIntent.setAction(Intent.ACTION_MAIN);
        receptorBluetooth = new ReceptorBluetooth(this, notificationIntent);

        getSupportFragmentManager().beginTransaction().replace(R.id.container, new MapaFragment()).commit();

        //Setting up application stuff
        NetworkManager.getInstance(this);
        accountManager = AccountManager.get(this);
        isLogged = (accountManager.getAccountsByType("com.example.serpumar.sprint0_3a").length > 0);
    } // onCreate()

    private BottomNavigationView.OnNavigationItemSelectedListener bottomNavMethod = new BottomNavigationView.OnNavigationItemSelectedListener() {
        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {

            Fragment fragment = null;
            switch (item.getItemId()) {
                case R.id.nav_mapa:
                    fragment = new MapaFragment();
                    break;

                case R.id.nav_recompensas:
                    fragment = new RecompensasFragment();
                    break;

                case R.id.nav_perfil:
                    fragment = new PerfilFragment();
                    break;
            }
            getSupportFragmentManager().beginTransaction().replace(R.id.container,fragment).commit();

            return true;
        }
    };

    @Override
    protected void onResume() {
        super.onResume();
        if (ContextCompat.checkSelfPermission(this.getApplicationContext(),
                android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
        } else {
            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION},
                    1);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.acciones_mainactivity, menu);
        menu.findItem(R.id.accion_start).setVisible(isLogged);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case R.id.accion_start:
                abrirActivityInfo(item);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    boolean flag = true;

    private void abrirActivityInfo(MenuItem item) {
        if (!receptorBluetooth.isRunning) {
            mostrarToast("Midiendo...", "El lector se ha iniciado");
            receptorBluetooth.activarAvisador(1, 30000);
            item.setIcon(R.drawable.ic_baseline_stop_24);
        }else{
            mostrarToast("Midiendo...", "El lector se ha detenido");
            receptorBluetooth.detenerAvisador();
            item.setIcon(R.drawable.ic_baseline_play_arrow_24);
        }
        /*
        Intent intent = new Intent(this, InfoActivity.class);
        startActivity(intent);
    */}



    public void mostrarToast(String title, String content) {
        LayoutInflater inflater = getLayoutInflater();
        View layout = inflater.inflate(R.layout.toast_personalizado, (ViewGroup)findViewById(R.id.toastpersonalizado));
        TextView textView = layout.findViewById(R.id.txtDistanciaToast);
        textView.setText(content);
        TextView textView1 = layout.findViewById(R.id.txtTituloToast);
        textView1.setText(title);
        Toast toast = new Toast(this);
        toast.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL, 0, 0);
        toast.setDuration(Toast.LENGTH_SHORT);
        toast.setView(layout);
        toast.show();
    }

    public ReceptorBluetooth getReceptorBluetooth() {
        return receptorBluetooth;
    }
} // class
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

