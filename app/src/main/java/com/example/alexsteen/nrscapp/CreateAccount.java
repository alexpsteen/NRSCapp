package com.example.alexsteen.nrscapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

public class CreateAccount extends AppCompatActivity {

    userDB userDB;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_account);
        userDB = new userDB(this);
    }

    public void createAccount(View view) {
        EditText firstName = (EditText) findViewById(R.id.user_first_name);
        EditText lastName = (EditText) findViewById(R.id.user_last_name);
        EditText cellphone = (EditText) findViewById(R.id.user_cellphone);
        EditText email = (EditText) findViewById(R.id.user_email);
        EditText username = (EditText) findViewById(R.id.user_username_entry);
        EditText password = (EditText) findViewById(R.id.user_password_entry);

        System.out.println("what");

        String user_first_name = firstName.getText().toString();
        String user_last_name = lastName.getText().toString();
        String user_cellphone = cellphone.getText().toString();
        String user_email = email.getText().toString();
        String user_username = username.getText().toString();
        String user_password = password.getText().toString();

        System.out.println("made it here");

        userObject user = new userObject(user_first_name,user_last_name,user_cellphone,user_email,user_username,user_password);

        userDB.addUsers(user);

        System.out.println("created Account");

        Intent intent = new Intent(this,Home.class);
        startActivity(intent);
    }
}
