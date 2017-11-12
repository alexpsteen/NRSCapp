package com.example.alexsteen.nrscapp;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.LinkedList;

/**
 * Created by ericachia on 4/13/17.
 */

public class eventDB extends SQLiteOpenHelper{

    private static final String DATABASE_NAME = "events.db";
    private static final String TABLE_EVENTS = "events";
    private static final String COLUMN_START_DATE = "startDate";
    private static final String COLUMN_END_DATE = "endDate";
    private static final String COLUMN_BUDGET = "budget";
    private static final String COLUMN_STATUS = "status";
    private static final String COLUMN_NAME = "name";


    public eventDB(Context context) {
        super(context, DATABASE_NAME, null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String query = "CREATE TABLE " + TABLE_EVENTS + " ("
                + COLUMN_START_DATE + " TEXT, "
                + COLUMN_END_DATE + " TEXT, "
                + COLUMN_BUDGET + " INTEGER, "
                + COLUMN_STATUS + " INTEGER,"
                + COLUMN_NAME + " TEXT);";

        db.execSQL(query);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        //Should never really call this, it deletes the whole table and makes a new one
        db.execSQL("DROP_TABLE_IF_EXISTS " + TABLE_EVENTS);
        onCreate(db);
    }

    /*
    Adds an event into the database
    @param events the eventObject being added
     */
    public void addEvent(eventObject events){
        ContentValues values = new ContentValues();
        SQLiteDatabase db = getWritableDatabase();
        values.put(COLUMN_START_DATE, events.getStartDate());
        values.put(COLUMN_END_DATE, events.getEndDate());
        values.put(COLUMN_BUDGET, events.getBudget());
        values.put(COLUMN_STATUS, events.getStatus());
        values.put(COLUMN_NAME, events.getName());
        db.insert(TABLE_EVENTS, null, values);
        db.close();
    }

    public LinkedList<eventObject> listOfEvents() {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_EVENTS, null);
        c.moveToFirst();
        LinkedList<eventObject> returnList = new LinkedList<>();
        while(!c.isAfterLast()) {
            String name = c.getString(c.getColumnIndex(COLUMN_NAME));
            String startDate = c.getString(c.getColumnIndex(COLUMN_START_DATE));
            String endDate = c.getString(c.getColumnIndex(COLUMN_END_DATE));
            int status = c.getInt(c.getColumnIndex(COLUMN_STATUS));
            int budget = c.getInt(c.getColumnIndex(COLUMN_BUDGET));

            returnList.add(new eventObject(name, status, startDate, endDate, budget));
            c.moveToNext();
        }
        c.close();
        db.close();
        return returnList;
    }

    public LinkedList<eventObject> listOfFinishedEvents() {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_EVENTS + " WHERE " + COLUMN_STATUS + " = 1;", null);
        c.moveToFirst();
        LinkedList<eventObject> returnList = new LinkedList<>();
        while(!c.isAfterLast()) {
            String name = c.getString(c.getColumnIndex(COLUMN_NAME));
            String startDate = c.getString(c.getColumnIndex(COLUMN_START_DATE));
            String endDate = c.getString(c.getColumnIndex(COLUMN_END_DATE));
            int status = c.getInt(c.getColumnIndex(COLUMN_STATUS));
            int budget = c.getInt(c.getColumnIndex(COLUMN_BUDGET));

            returnList.add(new eventObject(name, status, startDate, endDate, budget));
            c.moveToNext();
        }
        c.close();
        db.close();
        return returnList;
    }

    public LinkedList<eventObject> listOfCurrentEvents() {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_EVENTS +";", null);
        c.moveToFirst();
        LinkedList<eventObject> returnList = new LinkedList<>();
        while(!c.isAfterLast()) {
            String name = c.getString(c.getColumnIndex(COLUMN_NAME));
            String startDate = c.getString(c.getColumnIndex(COLUMN_START_DATE));
            String endDate = c.getString(c.getColumnIndex(COLUMN_END_DATE));
            int status = c.getInt(c.getColumnIndex(COLUMN_STATUS));
            int budget = c.getInt(c.getColumnIndex(COLUMN_BUDGET));

            returnList.add(new eventObject(name, status, startDate, endDate, budget));
            c.moveToNext();
        }
        c.close();
        db.close();
        return returnList;
    }

    public String getName(String name) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_EVENTS + " WHERE " + COLUMN_NAME + " = '" + name + "';", null);
        c.moveToFirst();
        String eventName = c.getString(c.getColumnIndex(COLUMN_NAME));
        c.close();
        db.close();
        return eventName;
    }

    public String getStartDate(String name) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_EVENTS + " WHERE " + COLUMN_NAME + " = '" + name + "';", null);
        c.moveToFirst();
        String startDate = c.getString(c.getColumnIndex(COLUMN_START_DATE));
        c.close();
        db.close();
        return startDate;
    }

    public String getEndDate(String name) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_EVENTS + " WHERE " + COLUMN_NAME + " = '" + name + "';", null);
        c.moveToFirst();
        String endDate = c.getString(c.getColumnIndex(COLUMN_END_DATE));
        c.close();
        db.close();
        return endDate;
    }

    public int getBudget(String name) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM " + TABLE_EVENTS + " WHERE " + COLUMN_NAME + " = '" + name + "';", null);
        c.moveToFirst();
        int budget = c.getInt(c.getColumnIndex(COLUMN_BUDGET));
        c.close();
        db.close();
        return budget;
    }

}
