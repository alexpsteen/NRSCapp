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
import android.widget.RadioGroup;
import android.widget.SeekBar;
import android.widget.Toast;

public class AddEvent extends AppCompatActivity {

    private String event_name, date_start, date_end;
    private int budget_amount;
    private boolean isBudgetBar = true;
    private final Integer BUDGET_MAX = 10000;

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
        final SeekBar budget_bar = (SeekBar) findViewById(R.id.budgetBar);
        final EditText budget_custom = (EditText) findViewById(R.id.budgetCustom);
        final RadioGroup budget_op = (RadioGroup) findViewById(R.id.budgetGroup);
        isBudgetBar = true;


        budget_op.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup radioGroup, int i) {
                if (i % 10 == 9) {
                    isBudgetBar = false;
                } else {
                    isBudgetBar = true;
                }}});

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
                if (isBudgetBar) {
                    budget_amount = budget_bar.getProgress() * BUDGET_MAX;
                } else {
                    budget_amount = Integer.parseInt(budget_custom.getText().toString());
                }

                //TODO: Add the event to the DB
                //budget_amount; //int
                //event_name; //string
                //date_start; //string (date)
                //date_end; //string (date)


                Intent in = new Intent(AddEvent.this, EventMain.class);
                startActivity(in);
                finish();
            }
        });
    }
}
