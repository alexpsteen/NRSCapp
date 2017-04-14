package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.media.Image;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TabHost;
import android.widget.TextView;

import org.w3c.dom.Text;

public class EventMain extends AppCompatActivity {

    private SharedPreferences currentEvent;
    private eventDB dbHandler;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_main);
        getSupportActionBar().hide();

        currentEvent = getSharedPreferences("CurrentEvent", MODE_PRIVATE);
        dbHandler = new eventDB(this);

        ImageView btn_back = (ImageView) findViewById(R.id.btn_back);
        Button add_feature = (Button) findViewById(R.id.addFeature);
        TextView event_name = (TextView) findViewById(R.id.tb_eventName);
        TextView date_range = (TextView) findViewById(R.id.tb_dateRange);

        String eventName = currentEvent.getString("eventName",null);
        event_name.setText(eventName);
        String startDate = dbHandler.getStartDate(eventName);
        String endDate = dbHandler.getEndDate(eventName);
        String dateRange = startDate + " - " + endDate;
        date_range.setText(dateRange);



        TabHost tabHost = (TabHost)findViewById(R.id.tabhost);
//        tabHost.setup();

        btn_back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        add_feature.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View view) {
                Intent in = new Intent(EventMain.this, AddVenue.class);
                startActivity(in);
            }});

//        TabHost.TabSpec tab1 = tabHost.newTabSpec("First Tab");
//        TabHost.TabSpec tab2 = tabHost.newTabSpec("Second Tab");
//        TabHost.TabSpec tab3 = tabHost.newTabSpec("Third Tab");
//
//
//        tab1.setIndicator("Tab1");
//        tab1.setContent(new Intent(this,EventFeaturesAll.class));
//        tabHost.addTab(tab1);
//
//        tab2.setIndicator("Tab2");
//        tab1.setContent(new Intent(this,EventFeaturesAll.class));
//        tabHost.addTab(tab2);
//
//        tab3.setIndicator("Tab3");
//        tab1.setContent(new Intent(this,EventFeaturesAll.class));
//        tabHost.addTab(tab3);

    }
}
