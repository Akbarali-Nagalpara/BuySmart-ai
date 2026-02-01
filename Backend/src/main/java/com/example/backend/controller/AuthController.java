package com.example.backend.controller;


import com.example.backend.entity.User;
import com.example.backend.security.JwtTokenUtil;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenUtil jwtTokenUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = authService.register(user);
            
            // Generate JWT token
            String token = jwtTokenUtil.generateToken(registeredUser.getEmail());
            
            // Return response matching frontend expectations
            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "user", Map.of(
                                    "id", registeredUser.getId().toString(),
                                    "email", registeredUser.getEmail(),
                                    "name", registeredUser.getName()
                            )
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User loggedIn = authService.login(user.getEmail(), user.getPassword());

        if (loggedIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        // Generate JWT token
        String token = jwtTokenUtil.generateToken(loggedIn.getEmail());

        // Return response matching frontend expectations
        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "user", Map.of(
                                "id", loggedIn.getId().toString(),
                                "email", loggedIn.getEmail(),
                                "name", loggedIn.getName()
                        )
                )
        );
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            String googleId = request.get("googleId");

            // Check if user already exists
            User existingUser = authService.findByEmail(email);
            
            User user;
            if (existingUser != null) {
                // User exists, just login
                user = existingUser;
            } else {
                // Create new user without password (Google OAuth user)
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setPassword(null); // No password for OAuth users
                user = authService.registerGoogleUser(newUser);
            }

            // Generate JWT token
            String token = jwtTokenUtil.generateToken(user.getEmail());

            // Return response matching frontend expectations
            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "user", Map.of(
                                    "id", user.getId().toString(),
                                    "email", user.getEmail(),
                                    "name", user.getName()
                            )
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to authenticate with Google: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, 
                                           @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenUtil.getEmailFromToken(token);
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            boolean changed = authService.changePassword(email, currentPassword, newPassword);
            
            if (changed) {
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Current password is incorrect"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to change password: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenUtil.getEmailFromToken(token);

            authService.deleteAccount(email);
            
            return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete account: " + e.getMessage()));
        }
    }

}
