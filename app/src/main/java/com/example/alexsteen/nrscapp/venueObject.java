package com.example.alexsteen.nrscapp;

/**
 * Created by ericachia on 4/14/17.
 */

public class venueObject {

    private String name;
    private String eventName;
    private String location;
    private String capacity;
    private String indoor;
    private String description;

    public venueObject(String eventName, String name, String location, String capacity, String indoor, String description) {
        this.eventName = eventName;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.indoor = indoor;
        this.description = description;
    }

    public String getEventName(){
        return eventName;
    }

    public String getName(){
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getCapacity() {
        return capacity;
    }

    public String getIndoor(){
        return indoor;
    }

    public String getDescription() {
        return description;
    }
}
