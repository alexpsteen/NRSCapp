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
    private eventPlannerDB eventPlannerDB;
    private vendorDB vendorDB;

    private SharedPreferences.Editor editCurrentUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login2);

        userDB = new userDB(this);
        eventPlannerDB = new eventPlannerDB(this);
        vendorDB = new vendorDB(this);
        SharedPreferences currentUser;
        currentUser = getSharedPreferences("CurrentUser", MODE_PRIVATE);
        editCurrentUser = currentUser.edit();
        editCurrentUser.apply();
    }

    public void loginSuccessful(View view) {
        EditText usernameText = (EditText) findViewById(R.id.login_username);
        EditText passwordText = (EditText) findViewById(R.id.login_password);
        EditText specialPassword = (EditText) findViewById(R.id.special_user_password);
        Intent intent;
            if(specialPassword.getText().toString().equals("vendor")) {
                if(vendorDB.authenticateUser(usernameText.getText().toString(), passwordText.getText().toString())) {
                    editCurrentUser.putString("username", usernameText.getText().toString());
                    editCurrentUser.commit();
                    intent = new Intent(this, VendorHome.class);
                    startActivity(intent);
                }  else {
                    int duration = Toast.LENGTH_SHORT;
                    Context context = getApplicationContext();
                    CharSequence text = "Username/Password Incorrect or Account is Locked";
                    Toast toast = Toast.makeText(context,text,duration);
                    toast.show();
                }
            } else if(specialPassword.getText().toString().equals("eventPlanner")) {
                if(eventPlannerDB.authenticateUser(usernameText.getText().toString(), passwordText.getText().toString())) {
                    editCurrentUser.putString("username", usernameText.getText().toString());
                    editCurrentUser.commit();
                    intent = new Intent(this, EventPlannerHome.class);
                    startActivity(intent);
                }  else {
                    int duration = Toast.LENGTH_SHORT;
                    Context context = getApplicationContext();
                    CharSequence text = "Username/Password Incorrect or Account is Locked";
                    Toast toast = Toast.makeText(context,text,duration);
                    toast.show();
                }
            } else {
                if (userDB.authenticateUser(usernameText.getText().toString(), passwordText.getText().toString())) {
                    editCurrentUser.putString("username", usernameText.getText().toString());
                    editCurrentUser.commit();
                    intent = new Intent(this, Home.class);
                    startActivity(intent);
                } else {
                    int duration = Toast.LENGTH_SHORT;
                    Context context = getApplicationContext();
                    CharSequence text = "Username/Password Incorrect or Account is Locked";
                    Toast toast = Toast.makeText(context, text, duration);
                    toast.show();
                }
            }
    }

    public void createAccount(View view) {
        System.out.println("testing");
        Intent intent = new Intent(this, CreateAccount.class);
        startActivity(intent);
    }
}
