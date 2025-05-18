package com.example.medicalstore.controller;

import com.example.medicalstore.model.Prescription;
import com.example.medicalstore.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/prescriptions")
public class PrescriptionController {
    @Autowired
    private PrescriptionService prescriptionService;

    // Predefined list of doctors
    private static final String[] DOCTORS = {"Dr. John Smith", "Dr. Emily Davis", "Dr. Michael Brown"};

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("prescription", new Prescription());
        model.addAttribute("doctors", DOCTORS);
        return "prescriptioncreate";
    }

    @PostMapping("/create")
    public String createPrescription(@ModelAttribute Prescription prescription, @RequestParam("photo") MultipartFile photo) {
        try {
            prescriptionService.createPrescription(prescription, photo);
            return "redirect:/prescriptions";
        } catch (IOException e) {
            return "redirect:/prescriptions/create?error=Failed to upload photo";
        } catch (IllegalArgumentException e) {
            return "redirect:/prescriptions/create?error=" + e.getMessage();
        }
    }

    @GetMapping
    public String listPrescriptions(Model model) {
        model.addAttribute("prescriptions", prescriptionService.getAllPrescriptions());
        return "prescriptionlist";
    }

    @GetMapping("/update/{id}")
    public String showUpdateForm(@PathVariable Long id, Model model) {
        Prescription prescription = prescriptionService.getPrescriptionById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid ID"));
        model.addAttribute("prescription", prescription);
        model.addAttribute("doctors", DOCTORS);
        return "prescriptionupdate";
    }

    @PostMapping("/update")
    public String updatePrescription(@ModelAttribute Prescription prescription, @RequestParam("photo") MultipartFile photo) {
        try {
            prescriptionService.updatePrescription(prescription, photo);
            return "redirect:/prescriptions";
        } catch (IOException e) {
            return "redirect:/prescriptions/update/" + prescription.getId() + "?error=Failed to upload photo";
        } catch (IllegalArgumentException e) {
            return "redirect:/prescriptions/update/" + prescription.getId() + "?error=" + e.getMessage();
        }
    }

    @GetMapping("/delete/{id}")
    public String deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return "redirect:/prescriptions";
    }
}