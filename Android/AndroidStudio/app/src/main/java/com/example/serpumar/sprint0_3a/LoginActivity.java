package com.example.serpumar.sprint0_3a;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends Activity {

    public static String getNombre() {
        return nombreUser;
    }

    private EditText nombre;
    private EditText contrasenya;
    private static String nombreUser;
    AccountManager accountManager;

    @Override
    protected void onCreate(Bundle savedInstance) {
        super.onCreate(savedInstance);
        setContentView(R.layout.activity_login);

        nombre = (EditText) findViewById(R.id.input_nombre);
        contrasenya = (EditText) findViewById(R.id.input_password);
        accountManager = AccountManager.get(getApplicationContext());

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

        //getWindow().setLayout((int) (width*0.75), (int) (height*0.4));

        WindowManager.LayoutParams params = getWindow().getAttributes();
        params.gravity = Gravity.CENTER;
        params.x = 0;
        params.y = -25;

        getWindow().setAttributes(params);
    }

    private void login() {
        nombreUser = nombre.getText().toString();
        final String contrasenyaUser = Utilidades.sha256(contrasenya.getText().toString());
        try {
            JSONObject userPOST = new JSONObject("{\"nombreUsuario\":"+nombreUser+",\"contrasenya\":"+contrasenyaUser+"}");
            NetworkManager networkManager = NetworkManager.getInstance(this);
            networkManager.postRequest(userPOST, "/login", new NetworkManager.ControladorRespuestas() {
                @Override
                public void getResult(Object object) {
                    try {
                        JSONObject user = new JSONObject(object.toString());
                        if (user.getBoolean("existe")){
                            Account account = new Account(nombreUser,"com.example.serpumar.sprint0_3a");
                            Bundle userData = new Bundle();
                            userData.putString("id", user.get("id").toString());
                            boolean success = accountManager.addAccountExplicitly(account,contrasenyaUser, userData);
                            if(success){
                                startActivity(new Intent(getApplicationContext(), MainActivity.class));
                            }else{
                                Toast.makeText(getApplicationContext(),"No se ha podido iniciar sesión, contacte con el administrador!",Toast.LENGTH_SHORT).show();
                            }

                        } else {
                            Toast.makeText(getApplicationContext(),"No existe la cuenta!",Toast.LENGTH_SHORT).show();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        } catch (JSONException e) {
            Toast.makeText(getApplicationContext(),"Asegurese de insertar el nombre de usuario",Toast.LENGTH_SHORT).show();
        }
    }
}
