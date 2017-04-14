package com.example.alexsteen.nrscapp;


/**
 * Created by ericachia on 4/13/17.
 */

public class eventObject {

    private String name;
    private int status;
    private String start_date;
    private String end_date;
    private int budget;


    public eventObject(String name, int status, String start_date, String end_date,int budget) {
        this.name = name;
        this.status = status;
        this.start_date = start_date;
        this.end_date = end_date;
        this.budget = budget;
    }

    public String getName() {
        return name;
    }

    public int getStatus() {
        return status;
    }

    public String getStartDate() {
        return start_date;
    }

    public String getEndDate(){
        return end_date;
    }

    public int getBudget(){
        return budget;
    }


}
