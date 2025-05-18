package com.example.medicalstore.service;

import com.example.medicalstore.model.Prescription;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {
    private static final String FILE_PATH = "src/main/resources/data/prescriptions.json";
    private static final String UPLOAD_DIR = "uploads/images/"; // Changed to external directory

    public PrescriptionService() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            try {
                file.getParentFile().mkdirs();
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    public void createPrescription(Prescription prescription, MultipartFile photo) throws IOException {
        if (photo != null && !photo.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, photo.getBytes());
            prescription.setPhotoUrl(fileName);
        }
        List<Prescription> prescriptions = getAllPrescriptions();
        prescription.setId(generateId(prescriptions));
        prescriptions.add(prescription);
        savePrescriptions(prescriptions);
    }

//    public List<Prescription> getAllPrescriptions() {
//        List<Prescription> prescriptions = new ArrayList<>();
//        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                String[] data = line.split(",");
//                if (data.length == 4) {
//                    prescriptions.add(new Prescription(
//                            Long.parseLong(data[0]),
//                            data[1],
//                            data[2],
//                            data[3]
//                    ));
//                }
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        return prescriptions;
//    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Prescription> getAllPrescriptions() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(file, new TypeReference<List<Prescription>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return getAllPrescriptions().stream()
                .filter(prescription -> prescription.getId().equals(id))
                .findFirst();
    }

    public void updatePrescription(Prescription updatedPrescription, MultipartFile photo) throws IOException {
        List<Prescription> prescriptions = getAllPrescriptions();
        prescriptions.removeIf(p -> p.getId().equals(updatedPrescription.getId()));
        if (photo != null && !photo.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, photo.getBytes());
            updatedPrescription.setPhotoUrl(fileName);
        }
        prescriptions.add(updatedPrescription);
        savePrescriptions(prescriptions);
    }

    public void deletePrescription(Long id) {
        List<Prescription> prescriptions = getAllPrescriptions();
        prescriptions.removeIf(p -> p.getId().equals(id));
        savePrescriptions(prescriptions);
    }

//    private void savePrescriptions(List<Prescription> prescriptions) {
//        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH))) {
//            for (Prescription prescription : prescriptions) {
//                writer.write(prescription.getId() + "," + prescription.getDoctorName() + "," +
//                        prescription.getDescription() + "," + prescription.getPhotoUrl());
//                writer.newLine();
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }

    private void savePrescriptions(List<Prescription> prescriptions) {
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), prescriptions);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private Long generateId(List<Prescription> prescriptions) {
        return prescriptions.stream().map(Prescription::getId).max(Long::compare).orElse(0L) + 1;
    }
}