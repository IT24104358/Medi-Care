package com.example.medicalstore.exception;

public class LiveDataException extends RuntimeException {
    public LiveDataException(String message) {
        super(message);
    }

    public LiveDataException(String message, Throwable cause) {
        super(message, cause);
    }
} 