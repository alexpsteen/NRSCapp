package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.content.SharedPreferences;
import android.widget.TextView;
import android.widget.LinearLayout;

import java.util.EventObject;
import java.util.LinkedList;

public class VendorEvents extends AppCompatActivity {

    private eventDB eventDB;

    private SharedPreferences.Editor editCurrentEvent;
    private SharedPreferences currentEvent;
    private SharedPreferences currentUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        System.out.println("Beginning of on create");
        System.out.println("Beginning of on create");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vendor_events);

        eventDB = new eventDB(this);
        currentUser = getSharedPreferences("CurrentUser", MODE_PRIVATE);
        currentEvent = getSharedPreferences("CurrentEvent", MODE_PRIVATE);
        editCurrentEvent = currentEvent.edit();
        editCurrentEvent.apply();

        LinearLayout layout = (LinearLayout) findViewById(R.id.vendorEvents);

        System.out.println("Getting Current Events");
        LinkedList<eventObject> events = new LinkedList<>();
        events.add(new eventObject("Wedding", 0, "12/29/2017", "12/30/2017", 30000));
        events.add(new eventObject("Birthday Party", 0, "11/02/2017", "11/02/2017", 500));
        System.out.println("Got the list");
        System.out.println(events.size());

        for(int i = 0; i < events.size(); i++) {
            System.out.println("in");
            Button j = new Button(this);
            j.setBackgroundResource(R.drawable.border);
            j.setText(events.get(i).getName());
            j.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent i = new Intent(VendorEvents.this, VendorHome.class);
                    startActivity(i);
                }
            });


            layout.addView(j);


        }
    }

    public void toFeaturePage(View view) {

    }
}
