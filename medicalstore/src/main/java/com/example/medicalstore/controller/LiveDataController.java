package com.example.medicalstore.controller;

import com.example.medicalstore.exception.LiveDataException;
import com.example.medicalstore.model.ErrorResponse;
import com.example.medicalstore.service.LiveDataService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/live-data")
public class LiveDataController {
    private final LiveDataService liveDataService;

    public LiveDataController(LiveDataService liveDataService) {
        this.liveDataService = liveDataService;
    }

    @GetMapping
    public ResponseEntity<ObjectNode> getLiveData() {
        return ResponseEntity.ok(liveDataService.getLiveData());
    }

    @PostMapping
    public ResponseEntity<ObjectNode> updateLiveData(@RequestBody ObjectNode newData) {
        return ResponseEntity.ok(liveDataService.updateLiveData(newData));
    }

    @ExceptionHandler(LiveDataException.class)
    public ResponseEntity<ErrorResponse> handleLiveDataException(
            LiveDataException ex,
            HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
            ex.getMessage(),
            request.getRequestURI(),
            HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
            "An unexpected error occurred",
            request.getRequestURI(),
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
} 