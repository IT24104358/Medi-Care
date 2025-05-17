import com.osanda.prescription.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping("/submitPrescription")
    public String handlePrescriptionUpload(@RequestParam("patientName") String patientName,
                                           @RequestParam("patientAge") int patientAge,
                                           @RequestParam("doctorName") String doctorName,
                                           @RequestParam("prescriptionDate") String prescriptionDate,
                                           @RequestParam(value = "notes", required = false) String notes,
                                           @RequestParam("file") MultipartFile file,
                                           RedirectAttributes redirectAttributes) {

        boolean isUploaded = prescriptionService.savePrescription(
                patientName, patientAge, doctorName, prescriptionDate, notes, file);

        if (isUploaded) {
            redirectAttributes.addFlashAttribute("successMessage", "✅ Prescription uploaded successfully!");
            return "redirect:/success"; // Redirect to success.html
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "❌ Upload failed. Try again.");
            return "redirect:/prescription.html"; // Redirect back to form
        }
    }

    @GetMapping("/success")
    public String showSuccessPage() {
        return "success"; // This refers to success.html
    }
}
