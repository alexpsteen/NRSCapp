package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import java.util.LinkedList;

public class UserVendors extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_vendors);

        LinearLayout layout = (LinearLayout) findViewById(R.id.userVendors);

        LinkedList<String> features = new LinkedList<>();
        features.add("China Dragon");

        for(int i = 0; i < features.size(); i++) {
            System.out.println("in");
            Button j = new Button(this);
            j.setBackgroundResource(R.drawable.border);
            j.setText(features.get(i));
            j.setId(i);
            j.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent i;
                    switch(view.getId()){
                        case 0:
                            i = new Intent(UserVendors.this, Restaurant1a.class);
                            startActivity(i);
                            break;
                        //Second button click
                    }
                }});


            layout.addView(j);


        }
    }


}
