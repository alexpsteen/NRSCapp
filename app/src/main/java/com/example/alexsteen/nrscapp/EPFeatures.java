package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import java.util.LinkedList;

public class EPFeatures extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_epfeatures);

        LinearLayout layout = (LinearLayout) findViewById(R.id.epFeatures);

        LinkedList<String> features = new LinkedList<>();
        features.add("Restaurant");
        features.add("Transportation");
        features.add("Flowers");

        for(int i = 0; i < features.size(); i++) {
            System.out.println("in");
            Button j = new Button(this);
            j.setBackgroundResource(R.drawable.border);
            j.setText(features.get(i));
            j.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent i = new Intent(EPFeatures.this, EPVendors.class);
                    startActivity(i);
                }
            });


            layout.addView(j);


        }
    }
}
