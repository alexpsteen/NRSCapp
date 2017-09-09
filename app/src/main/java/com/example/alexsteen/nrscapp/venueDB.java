package com.example.alexsteen.nrscapp;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.LinkedList;

/**
 * Created by ericachia on 4/14/17.
 */

public class venueDB extends SQLiteOpenHelper{

    private static final String DATABASE_NAME = "venues.db";
    private static final String TABLE_VENUES = "venues";
    private static final String COLUMN_EVENT_NAME = "eventName";
    private static final String COLUMN_NAME = "name";
    private static final String COLUMN_LOCATION= "location";
    private static final String COLUMN_CAPACITY = "capacity";
    private static final String COLUMN_INDOOR = "indoor";
    private static final String COLUMN_DESCRIPTION = "description";

    public venueDB(Context context) {
        super(context, DATABASE_NAME, null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String query = "CREATE TABLE " + TABLE_VENUES + " ("
                + COLUMN_EVENT_NAME + " TEXT, "
                + COLUMN_NAME + " TEXT, "
                + COLUMN_LOCATION + " TEXT, "
                + COLUMN_CAPACITY + " TEXT,"
                + COLUMN_DESCRIPTION + " TEXT,"
                + COLUMN_INDOOR + " TEXT);";

        db.execSQL(query);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        //Should never really call this, it deletes the whole table and makes a new one
        db.execSQL("DROP_TABLE_IF_EXISTS " + TABLE_VENUES);
        onCreate(db);
    }

    public void addVenue(venueObject venue){
        ContentValues values = new ContentValues();
        SQLiteDatabase db = getWritableDatabase();
        values.put(COLUMN_EVENT_NAME, venue.getEventName());
        values.put(COLUMN_NAME, venue.getName());
        values.put(COLUMN_LOCATION, venue.getLocation());
        values.put(COLUMN_CAPACITY, venue.getCapacity());
        values.put(COLUMN_INDOOR, venue.getIndoor());
        values.put(COLUMN_DESCRIPTION, venue.getDescription());
        db.insert(TABLE_VENUES, null, values);
        db.close();
    }

    public LinkedList<venueObject> listOfVenues(String eventName) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_VENUES + " WHERE " + COLUMN_EVENT_NAME + " = '" + eventName + "';", null);
        c.moveToFirst();
        LinkedList<venueObject> returnList = new LinkedList<>();
        while(!c.isAfterLast()) {
            String name = c.getString(c.getColumnIndex(COLUMN_NAME));
            String location = c.getString(c.getColumnIndex(COLUMN_LOCATION));
            String capacity = c.getString(c.getColumnIndex(COLUMN_CAPACITY));
            String indoor = c.getString(c.getColumnIndex(COLUMN_INDOOR));
            String description = c.getString(c.getColumnIndex(COLUMN_DESCRIPTION));

            returnList.add(new venueObject(eventName,name,location,capacity,indoor,description));
            c.moveToNext();
        }
        c.close();
        db.close();
        return returnList;
    }

}
