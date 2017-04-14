package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

public class AddFeature extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_feature);
        getSupportActionBar().hide();

        ImageView btn_back = (ImageView) findViewById(R.id.btn_back);
        Button btn_venue = (Button) findViewById(R.id.btn_venue);
        Button btn_food = (Button) findViewById(R.id.btn_food);
        Button btn_drinks = (Button) findViewById(R.id.btn_drinks);


        btn_venue.setOnClickListener(new View.OnClickListener() { @Override public void onClick(View view) {
                Intent in = new Intent(AddFeature.this, AddVenue.class); startActivity(in);
                //need to be able to come back to this screen
                finish();
        }});

        btn_back.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View view) { finish(); }
        });
    }
}
