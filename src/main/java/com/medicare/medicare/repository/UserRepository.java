package com.medicare.medicare.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicare.medicare.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

public class UserRepository {

    private static final String FILE_PATH = "src/main/resources/data/users.json";
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(UserRepository.class); // Added logging

    public UserRepository() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            try {
                file.getParentFile().mkdirs();
                file.createNewFile();
                Files.write(file.toPath(), "[]".getBytes());
                logger.info("Created new JSON file at: {}", file.getAbsolutePath());
            } catch (IOException e) {
                logger.error("Failed to create users.json: {}", e.getMessage());
            }
        }
    }

    public List<User> getAllUsers() {
        try {
            File file = new File(FILE_PATH);
            return mapper.readValue(file, new TypeReference<List<User>>() {});
        } catch (IOException e) {
            logger.error("Error reading users.json: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    public void saveAllUsers(List<User> users) {
        try {
            File file = new File(FILE_PATH);
            if (!file.canWrite()) {
                logger.error("Cannot write to users.json: Permission denied");
                throw new IOException("Cannot write to users.json: Permission denied");
            }
            mapper.writerWithDefaultPrettyPrinter().writeValue(file, users);
            logger.info("users.json updated successfully with {} users", users.size());
        } catch (IOException e) {
            logger.error("Failed to save users.json: {}", e.getMessage());
            throw new RuntimeException("Failed to save users.json", e);
        }
    }

    public void addUser(User user) {
        List<User> users = getAllUsers();
        user.setId(generateNextId(users));
        users.add(user);
        logger.info("Adding user: ID {}, Email {}", user.getId(), user.getEmail());
        saveAllUsers(users);
    }

    public void deleteUser(int id) {
        List<User> users = getAllUsers();
        users.removeIf(user -> user.getId() == id);
        logger.info("Deleting user: ID {}", id);
        saveAllUsers(users);
    }

    public User findByEmail(String email) {
        return getAllUsers().stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);
    }

    public void updateUser(User updatedUser) {
        List<User> users = getAllUsers();
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId() == updatedUser.getId()) {
                users.set(i, updatedUser);
                logger.info("Updating user in repository: ID {}", updatedUser.getId());
                saveAllUsers(users);
                return;
            }
        }
        logger.error("User with ID {} not found for update", updatedUser.getId());
        throw new RuntimeException("User not found: ID " + updatedUser.getId());
    }

    private int generateNextId(List<User> users) {
        return users.stream().mapToInt(User::getId).max().orElse(0) + 1;
    }
}