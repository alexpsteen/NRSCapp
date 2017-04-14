package com.example.alexsteen.nrscapp;

import android.media.Image;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class AddVenue extends AppCompatActivity {

    String location, notes;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_venue);
        getSupportActionBar().hide();

        final Spinner capacity = (Spinner) findViewById(R.id.ddl_capacity);
        ImageView btn_back = (ImageView) findViewById(R.id.btn_back);
        Button btn_save = (Button) findViewById(R.id.btn_save);
        final EditText tb_location = (EditText) findViewById(R.id.tb_location);
        final EditText tb_notes = (EditText) findViewById(R.id.tb_notes);
        final RadioGroup indoor = (RadioGroup) findViewById(R.id.indoorGroup);

        List<String> ddl_content = new ArrayList<>();

        ddl_content.add("Capacity");
        ddl_content.add("20 or less");
        ddl_content.add("20 to 40");
        ddl_content.add("40 to 60");
        ddl_content.add("60 to 100");
        ddl_content.add("Other (specify below)");

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, ddl_content);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        capacity.setAdapter(adapter);


        btn_back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        tb_location.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void afterTextChanged(Editable editable) {
                location = tb_location.getText().toString();
            }
        });

        tb_notes.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void afterTextChanged(Editable editable) {
                notes = tb_notes.getText().toString();
            }
        });

        btn_save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                RadioButton rb = (RadioButton) indoor.getChildAt(indoor.indexOfChild(indoor
                        .findViewById(indoor.getCheckedRadioButtonId())));


                //TODO: ADD TO DB
                String featureType = "Venue";
                String isIndoor = rb.getText().toString();
                String num_capacity = capacity.getSelectedItem().toString(); //capacity String
//                notes; //String
//                location; //String

                finish();
            }
        });
    }
}
