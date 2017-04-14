package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.media.Image;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TabHost;

public class EventMain extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_main);
        getSupportActionBar().hide();

        ImageView btn_back = (ImageView) findViewById(R.id.btn_back);
        Button add_feature = (Button) findViewById(R.id.addFeature);

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
