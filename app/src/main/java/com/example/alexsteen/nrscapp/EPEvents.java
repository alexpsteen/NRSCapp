package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import java.util.LinkedList;

public class EPEvents extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_epevents);

        LinearLayout layout = (LinearLayout) findViewById(R.id.epEvents);
        LinkedList<eventObject> events = new LinkedList<>();
        events.add(new eventObject("Wedding", 0, "12/29/2017", "12/30/2017", 30000));
        events.add(new eventObject("Birthday Party", 0, "11/02/2017", "11/02/2017", 500));

        for(int i = 0; i < events.size(); i++) {
            System.out.println("in");
            Button j = new Button(this);
            j.setBackgroundResource(R.drawable.border);
            j.setText(events.get(i).getName());
            j.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent i = new Intent(EPEvents.this, EPFeatures.class);
                    startActivity(i);
                }
            });


            layout.addView(j);


        }
    }


}
