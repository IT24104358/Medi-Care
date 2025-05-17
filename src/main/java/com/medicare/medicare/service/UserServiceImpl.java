package com.medicare.medicare.service;

import com.medicare.medicare.model.User;
import com.medicare.medicare.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class UserServiceImpl implements UserService {

    private final UserRepository userRepository = new UserRepository();
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class); // Added logging

    @Override
    public boolean registerUser(User user) {
        logger.info("Attempting to register user: {}", user.getEmail());
        if (userRepository.findByEmail(user.getEmail()) != null) {
            logger.warn("Email already exists: {}", user.getEmail());
            return false;
        }
        userRepository.addUser(user);
        logger.info("User registered successfully: {}", user.getEmail());
        return true;
    }

    @Override
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            logger.info("User logged in: {}", email);
            return user;
        }
        logger.warn("Login failed for email: {}", email);
        return null;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    @Override
    public boolean deleteUserById(int id) {
        User user = userRepository.getAllUsers().stream()
                .filter(u -> u.getId() == id)
                .findFirst()
                .orElse(null);

        if (user != null && user.getRole().toString().equals("USER")) {
            userRepository.deleteUser(id);
            logger.info("User deleted: ID {}", id);
            return true;
        }
        logger.warn("Cannot delete user: ID {} (Admin or not found)", id);
        return false;
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void updateUser(User updatedUser) {
        logger.info("Updating user: ID {}", updatedUser.getId());
        userRepository.updateUser(updatedUser);
        logger.info("User updated successfully: ID {}", updatedUser.getId());
    }
}
