// ------------------------------------------------------------------
// ------------------------------------------------------------------

package com.example.serpumar.sprint0_3a;

// ------------------------------------------------------------------
// ------------------------------------------------------------------
import android.os.Bundle;
import android.view.MenuItem;

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

} // class
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

