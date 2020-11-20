package com.example.serpumar.sprint0_3a;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;

public class LoginActivity extends Activity {

    public static String getNombre() {
        return nombreUser;
    }

    private EditText nombre;
    private EditText contrasenya;
    private static String nombreUser;

    @Override
    protected void onCreate(Bundle savedInstance) {
        super.onCreate(savedInstance);
        setContentView(R.layout.activity_login);

        nombre = (EditText) findViewById(R.id.input_nombre);
        contrasenya = (EditText) findViewById(R.id.input_password);

        Button iniciarSesion = (Button) findViewById(R.id.btn_login);
        iniciarSesion.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                login();
            }
        });

        popup();
    }

    private void popup() {

        DisplayMetrics dm = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(dm);

        int width = dm.widthPixels;
        int height = dm.heightPixels;

        getWindow().setLayout((int) (width*0.75), (int) (height*0.4));

        WindowManager.LayoutParams params = getWindow().getAttributes();
        params.gravity = Gravity.CENTER;
        params.x = 0;
        params.y = -25;

        getWindow().setAttributes(params);
    }

    private void login() {

        nombreUser = nombre.getText().toString();
        String contrasenyaUser = Utilidades.sha256(contrasenya.getText().toString());

        LogicaFake logicaFake= new LogicaFake(this);
        logicaFake.login(nombreUser,contrasenyaUser);

    }
}
