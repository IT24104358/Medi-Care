package com.medicalstore.model;

public class Review {
    private int rating;
    private String title;
    private String content;
    private String userName;
    private String userEmail;

    public Review() {}

    public Review(int rating, String title, String content, String userName, String userEmail) {
        this.rating = rating;
        this.title = title;
        this.content = content;
        this.userName = userName;
        this.userEmail = userEmail;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
