
package com.example.medicalstore.model;

public class Prescription {
    private Long id;
    private String doctorName;
    private String description;
    private String photoUrl; // Stores the filename of the uploaded photo

    public Prescription() {}

    public Prescription(Long id, String doctorName, String description, String photoUrl) {
        this.id = id;
        this.doctorName = doctorName;
        this.description = description;
        this.photoUrl = photoUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}