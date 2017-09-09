package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
public class userDetails extends AppCompatActivity {

    private userDB userDB;

    private SharedPreferences currentUser;
    private SharedPreferences.Editor editCurrentUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_details);

        currentUser = getSharedPreferences("CurrentUser", MODE_PRIVATE);
        editCurrentUser = currentUser.edit();
        editCurrentUser.apply();
        userDB = new userDB(this);
    }

    public void editDetails(View view) throws Exception{

        EditText newPassword = (EditText) findViewById(R.id.user_new_password);
        String new_password = newPassword.getText().toString();

        userDB.setPassword(currentUser.getString("username",null),new_password);

        Intent intent = new Intent(this, Home.class);
        startActivity(intent);
    }
}
