
package com.example.medicalstore.service;

import com.example.medicalstore.model.Feedback;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    private final String filePath = "src/main/resources/data/feedbacks.json";


    public FeedbackService() {
        File file = new File(filePath);
        if (!file.exists()) {
            try {
                file.getParentFile().mkdirs();
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void createFeedback(Feedback feedback) {
        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        List<Feedback> feedbacks = getAllFeedbacks();
        feedback.setId(generateId(feedbacks));
        feedbacks.add(feedback);
        saveFeedbacks(feedbacks);
    }

    public List<Feedback> getAllFeedbacks() {
        List<Feedback> feedbacks = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length == 3) {
                    feedbacks.add(new Feedback(
                            Long.parseLong(data[0]),
                            data[1],
                            Integer.parseInt(data[2])
                    ));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return feedbacks;
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return getAllFeedbacks().stream()
                .filter(feedback -> feedback.getId().equals(id))
                .findFirst();
    }

    public void updateFeedback(Feedback updatedFeedback) {
        if (updatedFeedback.getRating() < 1 || updatedFeedback.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        List<Feedback> feedbacks = getAllFeedbacks();
        feedbacks.removeIf(feedback -> feedback.getId().equals(updatedFeedback.getId()));
        feedbacks.add(updatedFeedback);
        saveFeedbacks(feedbacks);
    }

    public void deleteFeedback(Long id) {
        List<Feedback> feedbacks = getAllFeedbacks();
        feedbacks.removeIf(feedback -> feedback.getId().equals(id));
        saveFeedbacks(feedbacks);
    }

    private void saveFeedbacks(List<Feedback> feedbacks) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            for (Feedback feedback : feedbacks) {
                writer.write(feedback.getId() + "," + feedback.getComment() + "," + feedback.getRating());
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Long generateId(List<Feedback> feedbacks) {
        return feedbacks.stream().map(Feedback::getId).max(Long::compare).orElse(0L) + 1;
    }
}