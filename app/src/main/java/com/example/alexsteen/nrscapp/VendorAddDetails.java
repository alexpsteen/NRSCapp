package com.example.alexsteen.nrscapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

public class VendorAddDetails extends AppCompatActivity {

    private vendorDB vendorDB;
    private SharedPreferences currentUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vendor_add_details);

        vendorDB = new vendorDB(this);
        currentUser = getSharedPreferences("CurrentUser", MODE_PRIVATE);
    }

    public void saveInformation(View view) {
        EditText nameText = (EditText) findViewById(R.id.vendorName);
        EditText addressText = (EditText) findViewById(R.id.vendorAddress);
        EditText additionalInfoText  = (EditText) findViewById(R.id.vendorAdditionalInfo);

        vendorDB.setName(currentUser.getString("username",null),nameText.getText().toString());
        vendorDB.setAddress(currentUser.getString("username",null),addressText.getText().toString());
        vendorDB.setAdditionalInfo(currentUser.getString("username",null),additionalInfoText.getText().toString());
        Intent intent = new Intent(this, VendorHome.class);
        startActivity(intent);


    }
}
