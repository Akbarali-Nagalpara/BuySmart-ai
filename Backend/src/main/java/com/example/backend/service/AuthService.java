package com.example.backend.service;


import com.example.backend.entity.User;

public interface AuthService {

    User register(User user);

    User login(String email, String password);
    
    User findByEmail(String email);
    
    User registerGoogleUser(User user);
    
    boolean changePassword(String email, String currentPassword, String newPassword);
    
    void deleteAccount(String email);
}

