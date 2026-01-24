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

}
