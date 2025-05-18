package com.example.medicalstore.service;

import com.example.medicalstore.exception.LiveDataException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class LiveDataService {
    private final ObjectMapper objectMapper;
    private final String DATA_FILE_PATH = "data/live-data.json";

    public LiveDataService() {
        this.objectMapper = new ObjectMapper();
    }

    public ObjectNode getLiveData() {
        try {
            File file = new ClassPathResource(DATA_FILE_PATH).getFile();
            if (!file.exists()) {
                throw new LiveDataException("Data file not found");
            }
            return objectMapper.readValue(file, ObjectNode.class);
        } catch (IOException e) {
            throw new LiveDataException("Error reading live data", e);
        }
    }

    public ObjectNode updateLiveData(ObjectNode newData) {
        try {
            if (newData == null) {
                throw new LiveDataException("New data cannot be null");
            }

            File file = new ClassPathResource(DATA_FILE_PATH).getFile();
            if (!file.exists()) {
                throw new LiveDataException("Data file not found");
            }

            // Validate data structure
            if (!newData.has("data") || !newData.get("data").has("items")) {
                throw new LiveDataException("Invalid data structure. Must contain 'data.items' field");
            }

            newData.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            objectMapper.writeValue(file, newData);
            return newData;
        } catch (IOException e) {
            throw new LiveDataException("Error updating live data", e);
        }
    }
} 