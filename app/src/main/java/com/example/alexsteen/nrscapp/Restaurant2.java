package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class Restaurant2 extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_restaurant2);
    }

    public void back(View view) {
        Intent intent = new Intent(this, EPVendors.class);
        startActivity(intent);
    }

    public void recommend(View view) {
        Intent intent = new Intent(this, EPFeatures.class);
        startActivity(intent);
    }
}
