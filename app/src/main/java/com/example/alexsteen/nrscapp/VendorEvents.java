package com.example.alexsteen.nrscapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.content.SharedPreferences;
import android.widget.TextView;

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
        editCurrentEvent = currentEvent.edit();
        editCurrentEvent.apply();

        System.out.println("Getting Current Events");
        LinkedList<eventObject> events = eventDB.listOfCurrentEvents();
        System.out.println("Got the list");

        for(eventObject o:events) {
            TextView i = new TextView(this);
            i.setBackgroundResource(R.drawable.border);
            i.setText(o.getName());


        }
    }
}
