package com.example.alexsteen.nrscapp;

import android.content.Intent;
import android.media.Image;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

public class AddEvent extends AppCompatActivity {

    private String event_name, date_start, date_end;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_event);
        getSupportActionBar().hide();

        ImageView btn_back = (ImageView) findViewById(R.id.btn_back);
        final EditText et_eventName = (EditText) findViewById(R.id.tb_eventName);
        final EditText et_dateStart = (EditText) findViewById(R.id.tb_startDate);
        final EditText et_dateEnd = (EditText) findViewById(R.id.tb_endDate);
        final Button done = (Button) findViewById(R.id.btn_done);



        btn_back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        et_eventName.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {}
            @Override
            public void afterTextChanged(Editable editable) {
                event_name = et_eventName.getText().toString();
            }
        });

        et_dateStart.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {}
            @Override
            public void afterTextChanged(Editable editable) {
                date_start = et_dateStart.getText().toString();
            }
        });

        et_dateEnd.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {}
            @Override
            public void afterTextChanged(Editable editable) {
                date_end = et_dateEnd.getText().toString();
            }
        });

        done.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //TODO: Add the event to the DB

                Intent in = new Intent(AddEvent.this, EventMain.class);
                startActivity(in);
                finish();
            }
        });
    }
}
