package com.example.serpumar.sprint0_3a.Activities;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;

import com.airbnb.lottie.LottieAnimationView;
import com.example.serpumar.sprint0_3a.Activities.Main.MainActivity;
import com.example.serpumar.sprint0_3a.Helpers.Utilities;
import com.example.serpumar.sprint0_3a.R;


public class SplashScreenActivity extends AppCompatActivity {

    LottieAnimationView lottieAnimationView;
    LottieAnimationView lottieAnimationView2;
    ImageView imageView;


    /** Duration of wait **/
    private final int SPLASH_DISPLAY_LENGTH = 3000;


    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.splash_screen_activity);
        getSupportActionBar().hide();

        lottieAnimationView = findViewById(R.id.animationView);
        lottieAnimationView2 = findViewById(R.id.animationView2);
        imageView = findViewById(R.id.imageView2);


        /* New Handler to start the Menu-Activity
         * and close this Splash-Screen after some seconds.*/
        new Handler().postDelayed(new Runnable(){
            @Override
            public void run() {
                /* Create an Intent that will start the Menu-Activity. */
                Intent mainIntent = new Intent(SplashScreenActivity.this, MainActivity.class);
                startActivity(mainIntent);
                finish();
            }
        }, SPLASH_DISPLAY_LENGTH);
    }
}
