package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class Restaurant1a extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_restaurant1a);
    }

    public void reject(View view) {
        Intent intent = new Intent(this, EventMain.class);
        startActivity(intent);
    }

    public void confirm(View view) {
        Intent intent = new Intent(this, EventMain.class);
        startActivity(intent);
    }
}
