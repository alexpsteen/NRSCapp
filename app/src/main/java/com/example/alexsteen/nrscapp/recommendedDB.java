package com.example.alexsteen.nrscapp;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.LinkedList;

public class recommendedDB extends SQLiteOpenHelper{

    private static final String DATABASE_NAME = "recommended.db";
    private static final String TABLE_RECOMMENDED = "recommended";
    private static final String COLUMN_VENDOR_ID = "id";
    private static final String COLUMN_VENUE_NAME = "venueName";
    private static final String COLUMN_EVENT_NAME = "eventName";

    public recommendedDB(Context context) {
        super(context, DATABASE_NAME, null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String query = "CREATE TABLE " + TABLE_RECOMMENDED + " ("
                + COLUMN_VENDOR_ID + " TEXT, "
                + COLUMN_VENUE_NAME + " TEXT, "
                + COLUMN_EVENT_NAME + " TEXT);";

        db.execSQL(query);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        //Should never really call this, it deletes the whole table and makes a new one
        db.execSQL("DROP_TABLE_IF_EXISTS " + TABLE_RECOMMENDED);
        onCreate(db);
    }

    public LinkedList<String> listOfInterestedVendors(String venueName) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_RECOMMENDED + " WHERE " + COLUMN_VENUE_NAME + " = " + venueName +";", null);
        c.moveToFirst();
        LinkedList<String> returnList = new LinkedList<>();
        while(!c.isAfterLast()) {
            String vendorID = c.getString(c.getColumnIndex(COLUMN_VENDOR_ID));

            returnList.add(vendorID);
            c.moveToNext();
        }
        c.close();
        db.close();
        return returnList;
    }
}
