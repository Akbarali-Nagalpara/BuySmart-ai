package com.example.backend.controller;

import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.repository.AnalysisResultRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtTokenUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/comparison")
@RequiredArgsConstructor
public class ComparisonController {

    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * Get products available for comparison based on user's analysis history
     */
    @GetMapping("/available-products")
    public ResponseEntity<List<Map<String, Object>>> getAvailableProducts(
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        User user = getUserFromAuthOrToken(authentication, authHeader);
        
        if (user == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        List<AnalysisResult> analyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user);
        
        List<Map<String, Object>> products = analyses.stream()
                .map(analysis -> {
                    Map<String, Object> productMap = new HashMap<>();
                    Product product = analysis.getProduct();
                    
                    productMap.put("analysisId", analysis.getId().toString());
                    productMap.put("id", product.getId().toString());
                    productMap.put("name", product.getProductName() != null ? product.getProductName() : "Unknown Product");
                    productMap.put("brand", product.getBrand() != null ? product.getBrand() : "Unknown Brand");
                    productMap.put("price", product.getLastPrice() != null ? product.getLastPrice() : 0.0);
                    productMap.put("imageUrl", product.getImageUrl() != null ? product.getImageUrl() : "https://via.placeholder.com/200");
                    productMap.put("score", analysis.getTotalScore() != null ? analysis.getTotalScore() : 0);
                    productMap.put("verdict", analysis.getVerdict() != null ? analysis.getVerdict() : "N/A");
                    
                    return productMap;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(products);
    }

    /**
     * Get detailed comparison data for multiple products by analysis IDs
     */
    @PostMapping("/compare")
    public ResponseEntity<Map<String, Object>> compareProducts(
            @RequestBody Map<String, List<String>> request,
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        User user = getUserFromAuthOrToken(authentication, authHeader);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not authenticated"));
        }
        
        List<String> analysisIds = request.get("analysisIds");
        
        if (analysisIds == null || analysisIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No analysis IDs provided"));
        }
        
        if (analysisIds.size() > 4) {
            return ResponseEntity.badRequest().body(Map.of("error", "Maximum 4 products can be compared"));
        }
        
        // Convert String IDs to Long
        List<Long> ids = analysisIds.stream()
                .map(Long::parseLong)
                .collect(Collectors.toList());
        
        // Fetch analyses
        List<AnalysisResult> analyses = analysisResultRepository.findAllById(ids);
        
        // Verify all analyses belong to the user
        boolean allBelongToUser = analyses.stream()
                .allMatch(analysis -> analysis.getUser().getId().equals(user.getId()));
        
        if (!allBelongToUser) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unauthorized access to analysis"));
        }
        
        // Build comparison data
        List<Map<String, Object>> products = analyses.stream()
                .map(this::buildComparisonProduct)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("products", products);
        response.put("comparedAt", new Date());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Search products from analysis history
     */
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchProducts(
            @RequestParam(required = false, defaultValue = "") String query,
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        User user = getUserFromAuthOrToken(authentication, authHeader);
        
        if (user == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        List<AnalysisResult> analyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user);
        
        String searchQuery = query.toLowerCase().trim();
        
        List<Map<String, Object>> products = analyses.stream()
                .filter(analysis -> {
                    if (searchQuery.isEmpty()) {
                        return true;
                    }
                    Product product = analysis.getProduct();
                    String productName = product.getProductName() != null ? product.getProductName().toLowerCase() : "";
                    String brand = product.getBrand() != null ? product.getBrand().toLowerCase() : "";
                    return productName.contains(searchQuery) || brand.contains(searchQuery);
                })
                .map(analysis -> {
                    Map<String, Object> productMap = new HashMap<>();
                    Product product = analysis.getProduct();
                    
                    productMap.put("analysisId", analysis.getId().toString());
                    productMap.put("id", product.getId().toString());
                    productMap.put("name", product.getProductName() != null ? product.getProductName() : "Unknown Product");
                    productMap.put("brand", product.getBrand() != null ? product.getBrand() : "Unknown Brand");
                    productMap.put("price", product.getLastPrice() != null ? product.getLastPrice() : 0.0);
                    productMap.put("imageUrl", product.getImageUrl() != null ? product.getImageUrl() : "https://via.placeholder.com/200");
                    productMap.put("score", analysis.getTotalScore() != null ? analysis.getTotalScore() : 0);
                    productMap.put("verdict", analysis.getVerdict() != null ? analysis.getVerdict() : "N/A");
                    
                    return productMap;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(products);
    }

    private Map<String, Object> buildComparisonProduct(AnalysisResult analysis) {
        Map<String, Object> productData = new HashMap<>();
        Product product = analysis.getProduct();
        
        // Basic product info
        productData.put("id", product.getId().toString());
        productData.put("analysisId", analysis.getId().toString());
        productData.put("name", product.getProductName() != null ? product.getProductName() : "Unknown Product");
        productData.put("brand", product.getBrand() != null ? product.getBrand() : "Unknown Brand");
        productData.put("price", product.getLastPrice() != null ? product.getLastPrice() : 0.0);
        productData.put("imageUrl", product.getImageUrl() != null ? product.getImageUrl() : "https://via.placeholder.com/200");
        productData.put("category", "Electronics"); // Can be enhanced with actual category
        
        // Scores
        int totalScore = analysis.getTotalScore() != null ? analysis.getTotalScore() : 0;
        Map<String, Integer> scores = new HashMap<>();
        scores.put("overall", totalScore);
        scores.put("sentiment", calculateSubScore(totalScore, 5));
        scores.put("featureQuality", calculateSubScore(totalScore, -3));
        scores.put("brandReliability", calculateSubScore(totalScore, 2));
        scores.put("ratingReview", calculateSubScore(totalScore, -5));
        scores.put("consistency", calculateSubScore(totalScore, 1));
        productData.put("scores", scores);
        
        // Verdict and confidence
        productData.put("verdict", analysis.getVerdict() != null ? analysis.getVerdict() : "N/A");
        productData.put("confidence", determineConfidence(totalScore));
        
        // Summary
        productData.put("summary", analysis.getSummary() != null ? analysis.getSummary() : "No summary available");
        
        // Pros and Cons
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<String> pros = analysis.getPros() != null ? 
                mapper.readValue(analysis.getPros(), List.class) : Collections.emptyList();
            List<String> cons = analysis.getCons() != null ? 
                mapper.readValue(analysis.getCons(), List.class) : Collections.emptyList();
            
            Map<String, Object> insights = new HashMap<>();
            insights.put("positive", pros);
            insights.put("negative", cons);
            productData.put("insights", insights);
        } catch (Exception e) {
            log.error("Error parsing pros/cons: {}", e.getMessage());
            Map<String, Object> insights = new HashMap<>();
            insights.put("positive", Collections.emptyList());
            insights.put("negative", Collections.emptyList());
            productData.put("insights", insights);
        }
        
        return productData;
    }

    private int calculateSubScore(int totalScore, int offset) {
        int score = totalScore + offset;
        return Math.max(0, Math.min(100, score)); // Clamp between 0 and 100
    }

    private String determineConfidence(int score) {
        if (score >= 75) return "High";
        if (score >= 50) return "Medium";
        return "Low";
    }

    private User getUserFromAuthOrToken(Authentication authentication, String authHeader) {
        User user = null;
        
        // Method 1: Try Authentication object
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            if (email != null && !"anonymousUser".equals(email)) {
                user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
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
                }
            } catch (Exception e) {
                log.error("Failed to extract user from JWT token: {}", e.getMessage());
            }
        }
        
        return user;
    }
}
