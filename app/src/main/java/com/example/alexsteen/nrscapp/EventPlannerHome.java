package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class EventPlannerHome extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_planner_home);
    }

    public void viewCurrentEvents(View view) {
        Intent intent = new Intent(this, EPEvents.class);
        startActivity(intent);
    }
}
