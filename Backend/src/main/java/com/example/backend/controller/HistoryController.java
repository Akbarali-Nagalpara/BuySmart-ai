package com.example.backend.controller;

import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.User;
import com.example.backend.repository.AnalysisResultRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAnalysisHistory(
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        // Try to get user from authentication or JWT token
        User user = getUserFromAuthOrToken(authentication, authHeader);
        
        if (user == null) {
            // Return empty list for unauthenticated users
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        List<AnalysisResult> allAnalyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user);

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        
        List<Map<String, Object>> response = allAnalyses.stream()
                .map(analysis -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", analysis.getId().toString());
                    item.put("productName", analysis.getProduct().getProductName());
                    item.put("brand", analysis.getProduct().getBrand());
                    item.put("score", analysis.getOverallScore());
                    item.put("verdict", analysis.getVerdict());
                    item.put("date", dateFormat.format(analysis.getCreatedAt()));
                    item.put("imageUrl", analysis.getProduct().getImageUrl());
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private User getUserFromAuthOrToken(Authentication authentication, String authHeader) {
        User user = null;
        
        // Method 1: Try Authentication object
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            if (email != null && !"anonymousUser".equals(email)) {
                user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    log.info("User found via Authentication: {}", user.getEmail());
                    return user;
                }
            }
        }
        
        // Method 2: Try JWT token from header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtTokenUtil.getEmailFromToken(token);
                
                if (email != null && !"anonymousUser".equals(email)) {
                    user = userRepository.findByEmail(email).orElse(null);
                    if (user != null) {
                        log.info("User found via JWT token: {}", user.getEmail());
                    }
                }
            } catch (Exception e) {
                log.error("Failed to extract user from JWT token: {}", e.getMessage());
            }
        }
        
        return user;
    }
}
