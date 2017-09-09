package com.example.alexsteen.nrscapp;

/**
 * Created by ericachia on 9/9/17.
 */

public class userObject {

    private String firstName;
    private String lastName;
    private String cellphone;
    private String email;
    private String username;
    private String password;

    public userObject(String firstName, String lastName, String cellphone, String email, String username, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.cellphone = cellphone;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getCellphone() {
        return cellphone;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

}
