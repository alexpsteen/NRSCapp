package com.example.alexsteen.nrscapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.w3c.dom.Text;

public class VendorHome extends AppCompatActivity {

    private vendorDB vendorDB;
    SharedPreferences currentUser;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vendor_home);

        vendorDB = new vendorDB(this);
        currentUser = getSharedPreferences("CurrentUser", MODE_PRIVATE);

        TextView nameText = (TextView) findViewById(R.id.vendorNameLabel);
        nameText.setText(vendorDB.getName(currentUser.getString("username", null)));

        TextView emailText = (TextView) findViewById(R.id.vendorEmailLabel);
        emailText.setText(vendorDB.getEmail(currentUser.getString("username", null)));

        TextView cellPhoneText = (TextView) findViewById(R.id.vendorCellphoneLabel);
        cellPhoneText.setText(vendorDB.getCellPhone(currentUser.getString("username", null)));

        TextView addressText = (TextView) findViewById(R.id.vendorAddressLabel);
        addressText.setText(vendorDB.getAddress(currentUser.getString("username", null)));

        TextView additionalInfoText = (TextView) findViewById(R.id.vendorAdditionalInfoLabel);
        additionalInfoText.setText(vendorDB.getAddress(currentUser.getString("username", null)));
    }

    public void viewCurrentEvents(View view) {
        Intent intent = new Intent(this, VendorEvents.class);
        startActivity(intent);
    }
}
