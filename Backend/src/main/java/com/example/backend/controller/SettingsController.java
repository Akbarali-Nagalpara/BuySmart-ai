package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.UserSettings;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserSettingsRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class SettingsController {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getSettings(Authentication authentication) {
        try {
            // Handle when authentication is disabled - return default settings
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.ok(new SettingsDTO());
            }

            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get or create settings for the user
            UserSettings settings = userSettingsRepository.findByUser(user)
                    .orElseGet(() -> {
                        UserSettings newSettings = new UserSettings();
                        newSettings.setUser(user);
                        newSettings.setEmailNotifications(true);
                        newSettings.setPriceAlerts(true);
                        newSettings.setWeeklyDigest(false);
                        newSettings.setTheme("light");
                        return userSettingsRepository.save(newSettings);
                    });

            return ResponseEntity.ok(convertToDTO(settings));
        } catch (Exception e) {
            // Return default settings on error
            return ResponseEntity.ok(new SettingsDTO());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody SettingsDTO settingsDTO, Authentication authentication) {
        try {
            // Handle when authentication is disabled
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.ok(Map.of("message", "Settings updated successfully (demo mode)", "settings", settingsDTO));
            }

            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get or create settings
            UserSettings settings = userSettingsRepository.findByUser(user)
                    .orElseGet(() -> {
                        UserSettings newSettings = new UserSettings();
                        newSettings.setUser(user);
                        return newSettings;
                    });

            // Update settings
            settings.setEmailNotifications(settingsDTO.isEmailNotifications());
            settings.setPriceAlerts(settingsDTO.isPriceAlerts());
            settings.setWeeklyDigest(settingsDTO.isWeeklyDigest());
            settings.setTheme(settingsDTO.getTheme());

            // Save to database
            UserSettings savedSettings = userSettingsRepository.save(settings);

            return ResponseEntity.ok(Map.of(
                    "message", "Settings updated successfully",
                    "settings", convertToDTO(savedSettings)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to update settings: " + e.getMessage()));
        }
    }

    private SettingsDTO convertToDTO(UserSettings settings) {
        SettingsDTO dto = new SettingsDTO();
        dto.setEmailNotifications(settings.getEmailNotifications() != null ? settings.getEmailNotifications() : true);
        dto.setPriceAlerts(settings.getPriceAlerts() != null ? settings.getPriceAlerts() : true);
        dto.setWeeklyDigest(settings.getWeeklyDigest() != null ? settings.getWeeklyDigest() : false);
        dto.setTheme(settings.getTheme() != null ? settings.getTheme() : "light");
        return dto;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        try {
            // Handle when authentication is disabled
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Authentication required"));
            }

            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to change password: " + e.getMessage()));
        }
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(@RequestBody ChangeEmailRequest request, Authentication authentication) {
        try {
            // Handle when authentication is disabled
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Authentication required"));
            }

            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is incorrect"));
            }

            // Check if new email already exists
            if (userRepository.findByEmail(request.getNewEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
            }

            // Update email
            user.setEmail(request.getNewEmail());
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Email changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to change email: " + e.getMessage()));
        }
    }

    // DTO classes
    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }

    @Data
    public static class ChangeEmailRequest {
        private String newEmail;
        private String password;
    }

    // DTO class
    @Data
    public static class SettingsDTO {
        private boolean emailNotifications = true;
        private boolean priceAlerts = true;
        private boolean weeklyDigest = false;
        private String theme = "light";
    }
}
