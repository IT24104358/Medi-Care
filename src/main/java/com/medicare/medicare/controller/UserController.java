package com.medicare.medicare.controller;

import com.medicare.medicare.model.User;
import com.medicare.medicare.service.UserService;
import com.medicare.medicare.service.UserServiceImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService = new UserServiceImpl();
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/profile")
    public String showProfile(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            logger.warn("No user found in session, redirecting to login");
            return "redirect:/login";
        }
        logger.info("Displaying profile for user: {}", user.getEmail());
        model.addAttribute("user", user);
        return "profile";
    }

    @PostMapping("/update-profile")
    public String updateProfile(@ModelAttribute User updatedUser, HttpSession session, Model model) {
        User currentUser = (User) session.getAttribute("loggedInUser");
        if (currentUser == null) {
            logger.warn("No user found in session, redirecting to login");
            return "redirect:/login";
        }

        logger.info("Updating profile for user ID: {}", currentUser.getId());
        currentUser.setUsername(updatedUser.getUsername());
        currentUser.setEmail(updatedUser.getEmail());
        currentUser.setPhone(updatedUser.getPhone());
        currentUser.setAddress(updatedUser.getAddress());
        currentUser.setPassword(currentUser.getPassword());
        currentUser.setRole(currentUser.getRole());

        try {
            userService.updateUser(currentUser);
            session.setAttribute("loggedInUser", currentUser);
            model.addAttribute("success", "Profile updated successfully");
            logger.info("Profile updated successfully for user ID: {}", currentUser.getId());
        } catch (Exception e) {
            model.addAttribute("error", "Failed to update profile");
            logger.error("Error updating profile for user ID: {}: {}", currentUser.getId(), e.getMessage());
        }
        return "redirect:/user/profile";
    }
}
