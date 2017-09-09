package com.example.alexsteen.nrscapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

public class Login extends AppCompatActivity {

    private userDB userDB;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login2);

        userDB = new userDB(this);
    }

    public void loginSuccessful(View view) {
        EditText usernameText = (EditText) findViewById(R.id.login_username);
        EditText passwordText = (EditText) findViewById(R.id.login_password);
        if (userDB.authenticateUser(usernameText.getText().toString(), passwordText.getText().toString())) {
            Intent intent = new Intent(this,Home.class);
            startActivity(intent);
        } else {
            int duration = Toast.LENGTH_SHORT;
            Context context = getApplicationContext();
            CharSequence text = "Username/Password Incorrect or Account is Locked";
            Toast toast = Toast.makeText(context,text,duration);
            toast.show();
        }
    }

    public void createAccount(View view) {
        System.out.println("testing");
        Intent intent = new Intent(this, CreateAccount.class);
        startActivity(intent);
    }
}
