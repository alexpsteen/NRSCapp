package com.example.alexsteen.nrscapp;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class vendorDB extends SQLiteOpenHelper{

    private static final String DATABASE_NAME = "vendor.db";
    private static final String TABLE_VENDORS = "vendors";
    private static final String COLUMN_NAME = "name";
    private static final String COLUMN_ADDRESS = "address";
    private static final String COLUMN_CELLPHONE= "cellphone";
    private static final String COLUMN_EMAIL = "email";
    private static final String COLUMN_ADDITIONAL_INFO = "additionalInfo";
    private static final String COLUMN_USERNAME = "username";
    private static final String COLUMN_PASSWORD = "password";

    public vendorDB(Context context) {
        super(context, DATABASE_NAME, null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String query = "CREATE TABLE " + TABLE_VENDORS + " ("
                + COLUMN_NAME + " TEXT, "
                + COLUMN_ADDRESS + " TEXT, "
                + COLUMN_CELLPHONE + " TEXT, "
                + COLUMN_EMAIL + " TEXT,"
                + COLUMN_ADDITIONAL_INFO + " TEXT, "
                + COLUMN_USERNAME + " TEXT,"
                + COLUMN_PASSWORD + " TEXT);";

        db.execSQL(query);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        //Should never really call this, it deletes the whole table and makes a new one
        db.execSQL("DROP_TABLE_IF_EXISTS " + TABLE_VENDORS);
        onCreate(db);
    }

    public void addUsers(vendorObject vendor){
        ContentValues values = new ContentValues();
        SQLiteDatabase db = getWritableDatabase();
        values.put(COLUMN_NAME, vendor.getName());
        values.put(COLUMN_ADDRESS , vendor.getAddress());
        values.put(COLUMN_CELLPHONE, vendor.getCellphone());
        values.put(COLUMN_EMAIL, vendor.getEmail());
        values.put(COLUMN_ADDITIONAL_INFO, vendor.getAdditionalInfo());
        values.put(COLUMN_USERNAME, vendor.getUsername());
        values.put(COLUMN_PASSWORD, vendor.getPassword());
        db.insert(TABLE_VENDORS, null, values);
        db.close();
    }

    public boolean authenticateUser(String username, String password) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_VENDORS + " WHERE " + COLUMN_USERNAME + " = '" + username + "';", null);
        c.moveToFirst();
        String realPassword;
        if (!c.isBeforeFirst()) {
            realPassword = c.getString(c.getColumnIndex(COLUMN_PASSWORD));
        } else {
            return false;
        }

        c.close();
        db.close();
        return realPassword.equals(password);
    }

    public String getAdditionalInfo(String username) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_VENDORS + " WHERE " + COLUMN_USERNAME + " = '" + username + "';", null);
        c.moveToFirst();
        String additionalInfo = c.getString(c.getColumnIndex(COLUMN_ADDITIONAL_INFO));
        c.close();
        db.close();
        return additionalInfo;
    }

    public void setAdditionalInfo(String username, String additionalInfo) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_ADDITIONAL_INFO, additionalInfo);
        db.update(TABLE_VENDORS, values, COLUMN_USERNAME + "= '" + username + "';",null);
        db.close();
    }

    public void setAddress(String username, String address) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_ADDRESS, address);
        db.update(TABLE_VENDORS, values, COLUMN_USERNAME + "= '" + username + "';",null);
        db.close();
    }

    public void setName(String username, String name) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_NAME, name);
        db.update(TABLE_VENDORS, values, COLUMN_USERNAME + "= '" + username + "';",null);
        db.close();
    }

    public String getName(String username) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_VENDORS + " WHERE " + COLUMN_USERNAME + " = '" + username + "';", null);
        c.moveToFirst();
        String additionalInfo = c.getString(c.getColumnIndex(COLUMN_NAME));
        c.close();
        db.close();
        return additionalInfo;
    }

    public String getEmail(String username) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_VENDORS + " WHERE " + COLUMN_USERNAME + " = '" + username + "';", null);
        c.moveToFirst();
        String additionalInfo = c.getString(c.getColumnIndex(COLUMN_EMAIL));
        c.close();
        db.close();
        return additionalInfo;
    }

    public String getAddress(String username) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_VENDORS + " WHERE " + COLUMN_USERNAME + " = '" + username + "';", null);
        c.moveToFirst();
        String additionalInfo = c.getString(c.getColumnIndex(COLUMN_ADDRESS));
        c.close();
        db.close();
        return additionalInfo;
    }

    public String getCellPhone(String username) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_VENDORS + " WHERE " + COLUMN_USERNAME + " = '" + username + "';", null);
        c.moveToFirst();
        String additionalInfo = c.getString(c.getColumnIndex(COLUMN_CELLPHONE));
        c.close();
        db.close();
        return additionalInfo;
    }


}
