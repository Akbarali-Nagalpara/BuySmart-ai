package com.example.backend.controller;



import com.example.backend.DTO.request.AnalysisRequestDTO;
import com.example.backend.DTO.response.AnalysisResultDTO;
import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.Product;
import com.example.backend.service.AnalysisService;
import com.example.backend.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisResultController {

    private final AnalysisService analysisService;
    private final ProductService productService;

    // -------------------------------------------
    // Convert Entity → DTO
    // -------------------------------------------
    private AnalysisResultDTO convertToDTO(AnalysisResult result) {
        AnalysisResultDTO dto = new AnalysisResultDTO();
        dto.setId(result.getId());
        dto.setTotalScore(result.getTotalScore());
        dto.setVerdict(result.getVerdict());
        dto.setSummary(result.getSummary());
        dto.setAnalyzedAt(result.getAnalyzedAt());
        dto.setProduct(result.getProduct());
        return dto;
    }

    private Map<String, Object> convertToDetailedDTO(AnalysisResult result) {
        Map<String, Object> dto = new HashMap<>();
        
        // Product info
        Map<String, Object> productInfo = new HashMap<>();
        Product product = result.getProduct();
        
        productInfo.put("id", product.getProductId());
        
        String productName = product.getProductName();
        if (productName == null || productName.isEmpty()) {
            productName = "Unknown Product";
        }
        productInfo.put("name", productName);
        
        String brand = product.getBrand();
        if (brand == null || brand.isEmpty()) {
            brand = "Unknown Brand";
        }
        productInfo.put("brand", brand);
        
        Double price = product.getLastPrice();
        if (price == null) {
            price = 0.0;
        }
        productInfo.put("price", price);
        
        String imageUrl = product.getImageUrl();
        if (imageUrl == null || imageUrl.isEmpty()) {
            imageUrl = "https://via.placeholder.com/400x400?text=No+Image";
        }
        productInfo.put("imageUrl", imageUrl);
        
        productInfo.put("category", "Electronics");
        dto.put("product", productInfo);
        
        // Analysis scores
        dto.put("overallScore", result.getTotalScore() != null ? result.getTotalScore() : 0);
        dto.put("verdict", result.getVerdict() != null ? result.getVerdict() : "N/A");
        
        // Detailed scores (mock for now - you can enhance this)
        Map<String, Integer> scores = new HashMap<>();
        int totalScore = result.getTotalScore() != null ? result.getTotalScore() : 0;
        scores.put("sentiment", calculateSubScore(totalScore, 5));
        scores.put("featureQuality", calculateSubScore(totalScore, -3));
        scores.put("brandReliability", calculateSubScore(totalScore, 2));
        scores.put("ratingReview", calculateSubScore(totalScore, -5));
        scores.put("consistency", calculateSubScore(totalScore, 1));
        dto.put("scores", scores);
        
        // Insights
        Map<String, Object> insights = new HashMap<>();
        try {
            insights.put("positive", result.getPros() != null ? 
                new ObjectMapper().readValue(result.getPros(), List.class) : List.of());
            insights.put("negative", result.getCons() != null ? 
                new ObjectMapper().readValue(result.getCons(), List.class) : List.of());
        } catch (Exception e) {
            insights.put("positive", List.of());
            insights.put("negative", List.of());
        }
        dto.put("insights", insights);
        
        String summary = result.getSummary();
        if (summary == null || summary.isEmpty()) {
            summary = "Analysis completed successfully.";
        }
        dto.put("aiSummary", summary);
        
        return dto;
    }
    
    private int calculateSubScore(int totalScore, int variance) {
        int score = totalScore + variance;
        return Math.max(0, Math.min(100, score));
    }

    // ---------------------------------------------------------
    // 1️⃣ Save a new analysis (called after AI finishes)
    // ---------------------------------------------------------
    @PostMapping("/save")
    public ResponseEntity<?> saveAnalysis(@RequestBody AnalysisRequestDTO req) {

        Product product = productService.findByProductId(req.getProductId())
                .orElse(null);

        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found!");
        }

        AnalysisResult saved = analysisService.saveAnalysis(
                product,
                req.getTotalScore(),
                req.getVerdict(),
                req.getSummary()
        );

        return ResponseEntity.ok(convertToDTO(saved));
    }

    // ---------------------------------------------------------
    // 1a️⃣ Get analysis by ID
    // ---------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getAnalysisById(@PathVariable Long id) {
        return analysisService.findById(id)
                .map(analysis -> ResponseEntity.ok(convertToDetailedDTO(analysis)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------
    // 2️⃣ Get latest analysis of a product
    // ---------------------------------------------------------
    @GetMapping("/latest/{productId}")
    public ResponseEntity<?> getLatestAnalysis(@PathVariable String productId) {
        AnalysisResult latest = analysisService.getLatestAnalysis(productId);

        if (latest == null) {
            return ResponseEntity.badRequest()
                    .body("No analysis found for product: " + productId);
        }

        return ResponseEntity.ok(convertToDTO(latest));
    }

    // ---------------------------------------------------------
    // 3️⃣ Get full analysis history of a product
    // ---------------------------------------------------------
    @GetMapping("/history/{productId}")
    public ResponseEntity<?> getHistory(@PathVariable String productId) {

        List<AnalysisResult> list = analysisService.getAnalysisHistory(productId);

        if (list.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("No analysis history for product: " + productId);
        }

        return ResponseEntity.ok(
                list.stream().map(this::convertToDTO).collect(Collectors.toList())
        );
    }

    // ---------------------------------------------------------
    // 4️⃣ Debug: get all analysis results
    // ---------------------------------------------------------
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(
                analysisService.getAll().stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList())
        );
    }

    // ---------------------------------------------------------
    // 5️⃣ Delete analysis by ID
    // ---------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnalysis(@PathVariable Long id) {
        try {
            Optional<AnalysisResult> analysis = analysisService.findById(id);
            if (analysis.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            analysisService.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Analysis deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to delete analysis: " + e.getMessage()));
        }
    }
}

