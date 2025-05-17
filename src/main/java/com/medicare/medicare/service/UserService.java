package com.medicare.medicare.service;


import com.medicare.medicare.model.User;

import java.util.List;

public interface UserService {
    boolean registerUser(User user);
    User login(String email, String password);
    List<User> getAllUsers();
    boolean deleteUserById(int id);
    User getUserByEmail(String email);
    void updateUser(User updatedUser);
}
