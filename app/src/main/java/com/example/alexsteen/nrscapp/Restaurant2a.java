package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class Restaurant2a extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_restaurant2a);
    }

    public void back(View view) {
        Intent intent = new Intent(this, UserVendors.class);
        startActivity(intent);
    }

    public void confirm(View view) {
        Intent intent = new Intent(this, EventMain.class);
        startActivity(intent);
    }
}
