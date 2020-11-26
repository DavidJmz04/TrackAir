// ------------------------------------------------------------------
// ------------------------------------------------------------------

package com.example.serpumar.sprint0_3a;

// ------------------------------------------------------------------
// ------------------------------------------------------------------
import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.example.serpumar.sprint0_3a.Fragments.MapaFragment;
import com.example.serpumar.sprint0_3a.Fragments.PerfilFragment;
import com.example.serpumar.sprint0_3a.Fragments.RecompensasFragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

// ------------------------------------------------------------------
// ------------------------------------------------------------------

public class MainActivity extends AppCompatActivity {

    private BottomNavigationView bottomNavigationView;

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bottomNavigationView=findViewById(R.id.bottomNav);
        bottomNavigationView.setOnNavigationItemSelectedListener(bottomNavMethod);

        getSupportFragmentManager().beginTransaction().replace(R.id.container, new MapaFragment()).commit();
        NetworkManager.getInstance(this);

        NetworkManager.getInstance(this);

        AccountManager accountManager = AccountManager.get(this);
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
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.acciones_mainactivity, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case R.id.accion_info:
                abrirActivityInfo();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void abrirActivityInfo() {
        Intent intent = new Intent(this, InfoActivity.class);
        startActivity(intent);
    }

} // class
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

