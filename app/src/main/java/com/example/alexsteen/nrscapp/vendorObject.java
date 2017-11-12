package com.example.alexsteen.nrscapp;

/**
 * Created by ericachia on 11/12/17.
 */

public class vendorObject {

    private String id;
    private String name;
    private String address;
    private String cellphone;
    private String email;
    private String additionalInfo;
    private String username;
    private String password;

    public vendorObject(String name, String address, String cellphone, String email, String additionalInfo, String username, String password) {
        this.name = name;
        this.address = address;
        this.cellphone = cellphone;
        this.email = email;
        this.additionalInfo = additionalInfo;
        this.username = username;
        this.password = password;
    }

    public String getID() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getCellphone() {
        return cellphone;
    }

    public String getEmail() {
        return email;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
