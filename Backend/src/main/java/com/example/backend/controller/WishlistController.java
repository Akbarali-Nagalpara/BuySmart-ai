package com.example.backend.controller;

import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.entity.WishlistItem;
import com.example.backend.repository.AnalysisResultRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class WishlistController {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AnalysisResultRepository analysisResultRepository;

    @GetMapping
    @Transactional
    public ResponseEntity<?> getWishlist(Authentication authentication) {
        try {
            System.out.println("=== GET WISHLIST REQUEST ===");
            
            if (authentication == null) {
                System.err.println("Authentication is NULL!");
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            String userEmail = authentication.getName();
            System.out.println("User email from authentication: " + userEmail);
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("Found user with ID: " + user.getId());

            List<WishlistItem> wishlistItems = wishlistItemRepository.findByUserOrderByAddedAtDesc(user);
            System.out.println("Found " + wishlistItems.size() + " wishlist items from database");
            
            // Log each item - force lazy loading while in transaction
            for (WishlistItem item : wishlistItems) {
                // Force initialization of lazy-loaded product
                item.getProduct().getProductName();
                System.out.println("  - Item ID: " + item.getId() + 
                                 ", Product: " + item.getProduct().getProductName() +
                                 ", Added: " + item.getAddedAt());
            }
            
            List<WishlistItemDTO> dtoList = wishlistItems.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            System.out.println("Returning " + dtoList.size() + " wishlist items DTO for user: " + userEmail);
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error fetching wishlist: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody AddToWishlistRequest request, Authentication authentication) {
        try {
            System.out.println("=== ADD TO WISHLIST REQUEST ===");
            String userEmail = authentication.getName();
            System.out.println("User email: " + userEmail);
            System.out.println("Product name: " + request.getProductName());
            System.out.println("Product ID: " + request.getProductId());
            System.out.println("Brand: " + request.getBrand());
            System.out.println("Price: " + request.getCurrentPrice());
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("Found user with ID: " + user.getId());

            // Check if product exists, if not create it
            Product product = productRepository.findByProductId(request.getProductId())
                    .orElseGet(() -> {
                        Product newProduct = new Product();
                        newProduct.setProductId(UUID.randomUUID().toString());
                        newProduct.setProductName(request.getProductName());
                        newProduct.setBrand(request.getBrand());
                        newProduct.setImageUrl(request.getImageUrl());
                        newProduct.setLastPrice(request.getCurrentPrice());
                        Product saved = productRepository.save(newProduct);
                        System.out.println("Created new product with ID: " + saved.getProductId());
                        return saved;
                    });

            // Check if already in wishlist
            if (wishlistItemRepository.existsByUserAndProductProductId(user, product.getProductId())) {
                System.out.println("Product already in wishlist");
                return ResponseEntity.badRequest().body(Map.of("message", "Product already in wishlist"));
            }

            // Create wishlist item
            WishlistItem wishlistItem = new WishlistItem();
            wishlistItem.setUser(user);
            wishlistItem.setProduct(product);
            wishlistItem.setPriceAtAddition(request.getCurrentPrice());
            wishlistItem.setNotifyOnPriceDrop(true);
            wishlistItem.setAddedAt(LocalDateTime.now());

            WishlistItem saved = wishlistItemRepository.save(wishlistItem);
            System.out.println("Saved wishlist item with ID: " + saved.getId());

            return ResponseEntity.ok(convertToDTO(saved, request.getAnalysisId(), 
                    request.getScore(), request.getVerdict()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to add to wishlist: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long id, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            WishlistItem item = wishlistItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

            if (!item.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("message", "Unauthorized"));
            }

            wishlistItemRepository.delete(item);
            return ResponseEntity.ok(Map.of("message", "Item removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to remove from wishlist"));
        }
    }

    private WishlistItemDTO convertToDTO(WishlistItem item) {
        // Get the latest analysis for this product
        List<AnalysisResult> analyses = analysisResultRepository
                .findByProductAndUserOrderByAnalyzedAtDesc(item.getProduct(), item.getUser());
        
        AnalysisResult latestAnalysis = analyses.isEmpty() ? null : analyses.get(0);

        return convertToDTO(item, 
                latestAnalysis != null ? latestAnalysis.getId().toString() : null,
                latestAnalysis != null ? latestAnalysis.getTotalScore() : null,
                latestAnalysis != null ? latestAnalysis.getVerdict() : null);
    }

    private WishlistItemDTO convertToDTO(WishlistItem item, String analysisId, Integer score, String verdict) {
        WishlistItemDTO dto = new WishlistItemDTO();
        dto.setId(item.getId().toString());
        dto.setProductName(item.getProduct().getProductName());
        dto.setBrand(item.getProduct().getBrand());
        dto.setCurrentPrice(item.getProduct().getLastPrice() != null ? item.getProduct().getLastPrice() : 0.0);
        dto.setOriginalPrice(item.getPriceAtAddition() != null ? item.getPriceAtAddition() : 0.0);
        dto.setImageUrl(item.getProduct().getImageUrl());
        dto.setRating(0.0); // Can be enhanced to fetch actual ratings
        dto.setScore(score);
        dto.setVerdict(verdict);
        dto.setAnalysisId(analysisId);
        dto.setAddedDate(item.getAddedAt() != null ? item.getAddedAt().toString() : LocalDateTime.now().toString());
        return dto;
    }

    // DTOs
    public static class WishlistItemDTO {
        private String id;
        private String productName;
        private String brand;
        private double currentPrice;
        private double originalPrice;
        private String imageUrl;
        private double rating;
        private Integer score;
        private String verdict;
        private String analysisId;
        private String addedDate;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        
        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }
        
        public double getCurrentPrice() { return currentPrice; }
        public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }
        
        public double getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        
        public double getRating() { return rating; }
        public void setRating(double rating) { this.rating = rating; }
        
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
        
        public String getVerdict() { return verdict; }
        public void setVerdict(String verdict) { this.verdict = verdict; }
        
        public String getAnalysisId() { return analysisId; }
        public void setAnalysisId(String analysisId) { this.analysisId = analysisId; }
        
        public String getAddedDate() { return addedDate; }
        public void setAddedDate(String addedDate) { this.addedDate = addedDate; }
    }

    public static class AddToWishlistRequest {
        private String productId;
        private String productName;
        private String brand;
        private double currentPrice;
        private String imageUrl;
        private String analysisId;
        private Integer score;
        private String verdict;

        // Getters and Setters
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }

        public double getCurrentPrice() { return currentPrice; }
        public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getAnalysisId() { return analysisId; }
        public void setAnalysisId(String analysisId) { this.analysisId = analysisId; }

        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }

        public String getVerdict() { return verdict; }
        public void setVerdict(String verdict) { this.verdict = verdict; }
    }
}
