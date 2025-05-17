package com.medicare.medicare.controller;

import com.medicare.medicare.model.Role;
import com.medicare.medicare.model.User;
import com.medicare.medicare.service.UserService;
import com.medicare.medicare.service.UserServiceImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@Controller
public class AuthController {

    private final UserService userService = new UserServiceImpl();

    @GetMapping("/")
    public String showWelcomePage() {
        return "welcome"; // maps to welcome.html
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login"; // maps to login.html
    }

    @PostMapping("/processLogin")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        HttpSession session,
                        Model model) {
        User user = userService.login(email, password);
        if (user != null) {
            session.setAttribute("loggedInUser", user);
            return user.getRole() == Role.ADMIN ? "redirect:/admin/users" : "redirect:/user/profile";
        }
        model.addAttribute("error", "Invalid email or password");
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register"; // maps to register.html
    }

    @PostMapping("/processRegister")
    public String register(@ModelAttribute User user, Model model) {
        user.setRole(Role.USER); // only users can register
        boolean success = userService.registerUser(user);
        if (!success) {
            model.addAttribute("error", "Email already exists");
            return "register";
        }
        return "redirect:/login";
    }
    @GetMapping("/index")
    public String showHomePage(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/"; // Redirect unauthenticated users to welcome.html
        }
        model.addAttribute("user", user);
        return "index";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}