package com.example.medicalstore.model;

import java.time.LocalDateTime;

public class ErrorResponse {
    private LocalDateTime timestamp;
    private String message;
    private String path;
    private int status;

    public ErrorResponse(String message, String path, int status) {
        this.timestamp = LocalDateTime.now();
        this.message = message;
        this.path = path;
        this.status = status;
    }

    // Getters and setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public int getStatus() {
        return status;
    }
} 