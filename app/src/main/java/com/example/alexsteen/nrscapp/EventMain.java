package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.media.Image;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.SeekBar;
import android.widget.TabHost;
import android.widget.TextView;
import android.widget.AdapterView;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.LinkedList;

import static com.example.alexsteen.nrscapp.R.drawable.border;

public class EventMain extends AppCompatActivity {

    private SharedPreferences currentEvent;
    private eventDB dbHandler;
    private venueDB dbHandler1;


    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_main);
        getSupportActionBar().hide();

        currentEvent = getSharedPreferences("CurrentEvent", MODE_PRIVATE);
        dbHandler = new eventDB(this);
        dbHandler1 = new venueDB(this);

        ImageView btn_back = (ImageView) findViewById(R.id.btn_back);
        Button add_feature = (Button) findViewById(R.id.addFeature);
        TextView event_name = (TextView) findViewById(R.id.tb_eventName);
        TextView date_range = (TextView) findViewById(R.id.tb_dateRange);
        ProgressBar budget_bar = (ProgressBar) findViewById(R.id.budgetBar);

        budget_bar.setScaleY(4f);

        String eventName = currentEvent.getString("eventName",null);
        event_name.setText(eventName);
        String startDate = dbHandler.getStartDate(eventName);
        String endDate = dbHandler.getEndDate(eventName);
        String dateRange = startDate + " - " + endDate;
        date_range.setText(dateRange);



        TabHost tabHost = (TabHost)findViewById(R.id.featureTabs);
        tabHost.setup();

        btn_back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(EventMain.this, Home.class);
                startActivity(i);
            }
        });

        add_feature.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View view) {
                Intent in = new Intent(EventMain.this, AddFeature.class);
                startActivity(in);
            }});

        LinearLayout layout1 = (LinearLayout) findViewById(R.id.tab1);
        LinearLayout layout3 = (LinearLayout) findViewById(R.id.tab3);
//        LinkedList<venueObject> events = dbHandler1.listOfVenues(eventName);

        LinkedList<String> features = new LinkedList<>();
        features.add("Restaurant");
        features.add("Transportation");
        features.add("Flowers");


//        for(venueObject o:events) {
//            TextView i = new TextView(this);
//            TextView j = new TextView(this);
//            j.setText(o.getName());
//            j.setBackgroundResource(R.drawable.border);
//            i.setBackgroundResource(R.drawable.border);
//            i.setText(o.getName());
//            layout1.addView(i);
//            layout3.addView(j);
//
//        }

        for(int i = 0; i < features.size(); i++) {
            System.out.println("in");
            Button j = new Button(this);
            Button k = new Button(this);
            j.setBackgroundResource(R.drawable.border);
            j.setText(features.get(i));
            k.setBackgroundResource(R.drawable.border);
            k.setText(features.get(i));
            j.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent i = new Intent(EventMain.this, UserVendors.class);
                    startActivity(i);
                }
            });


            layout1.addView(j);
            layout3.addView(k);


        }

        TabHost.TabSpec tab1 = tabHost.newTabSpec("First Tab");
        TabHost.TabSpec tab2 = tabHost.newTabSpec("Second Tab");
        TabHost.TabSpec tab3 = tabHost.newTabSpec("Third Tab");


        tab1.setIndicator("All");
        tab1.setContent(R.id.tab1);
        //tab1.setContent(new Intent(this,EventFeaturesAll.class));
        tabHost.addTab(tab1);

        tab2.setIndicator("Completed");
        tab2.setContent(R.id.tab2);
        //tab1.setContent(new Intent(this,EventFeaturesAll.class));
        tabHost.addTab(tab2);

        tab3.setIndicator("Incomplete");
        tab3.setContent(R.id.tab3);
        //tab1.setContent(new Intent(this,EventFeaturesAll.class));
        tabHost.addTab(tab3);

    }
}
