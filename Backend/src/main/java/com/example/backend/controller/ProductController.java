package com.example.backend.controller;




import com.example.backend.DTO.cache.RawCacheDTO;
import com.example.backend.DTO.request.ProductRequestDTO;
import com.example.backend.DTO.response.ProductResponseDTO;
import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.service.AnalysisService;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final AnalysisService analysisService;
    private final ObjectMapper objectMapper;
    private final com.example.backend.repository.UserRepository userRepository;
    private final com.example.backend.service.SearchHistoryService searchHistoryService;

    // ------------------------------------------------------------
    // Health Check Endpoint
    // ------------------------------------------------------------
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "ProductController is working",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    // ------------------------------------------------------------
    // 1a. Search Products by Query (GET endpoint for frontend)
    // ------------------------------------------------------------
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchProducts(@RequestParam String query) {
        try {
            if (query == null || query.isBlank()) {
                return ResponseEntity.badRequest().build();
            }

            // Get ASINs from search query
            List<String> asins = productService.searchAsins(query);
            
            if (asins.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            // Limit to first 5 results
            List<Map<String, Object>> results = asins.stream()
                    .limit(10)
                    .map(asin -> {
                        try {
                            // Check if we have this product in cache/DB
                            Map<String, Object> result = new HashMap<>();
                            result.put("id", asin);
                            
                            // Try to get from existing product
                            productService.findByProductId(asin).ifPresentOrElse(
                                product -> {
                                    result.put("name", product.getProductName());
                                    result.put("brand", product.getBrand());
                                    result.put("price", product.getLastPrice());
                                    result.put("imageUrl", product.getImageUrl());
                                    result.put("rating", 4.5); // Default or fetch from raw data
                                    result.put("reviewCount", 1000); // Default or fetch from raw data
                                },
                                () -> {
                                    // Product not in DB yet, fetch basic info
                                    try {
                                        Map<String, Object> details = productService.fetchProductDetails(asin);
                                        log.info("Fetched details for ASIN {}: keys={}, title={}", 
                                            asin, details.keySet(), details.get("title"));
                                        
                                        // ❌ REMOVED: Don't cache during search - only cache when user analyzes
                                        // This prevents creating 10-20 cache entries for a single search
                                        // Caching will happen in /analyze endpoint when user selects a product
                                        
                                        String productName = (String) details.getOrDefault("title", "Unknown Product");
                                        log.info("Setting product name for ASIN {}: '{}'", asin, productName);
                                        
                                        result.put("name", productName);
                                        result.put("brand", details.getOrDefault("brand", "Unknown Brand"));
                                        result.put("price", details.getOrDefault("price", 0.0));
                                        result.put("imageUrl", details.getOrDefault("imageUrl", ""));
                                        result.put("rating", details.getOrDefault("rating", 0.0));
                                        result.put("reviewCount", details.getOrDefault("reviewCount", 0));
                                    } catch (Exception e) {
                                        log.error("Error fetching product details for ASIN {}", asin, e);
                                        result.put("name", "Product " + asin);
                                        result.put("brand", "Unknown");
                                        result.put("price", 0.0);
                                        result.put("imageUrl", "");
                                        result.put("rating", 0.0);
                                        result.put("reviewCount", 0);
                                    }
                                }
                            );
                            
                            return result;
                        } catch (Exception e) {
                            log.error("Error processing ASIN {}", asin, e);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(results);
            
        } catch (Exception e) {
            log.error("Search failed for query: {}", query, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ------------------------------------------------------------
    // 1b. Search Product → Fetch Raw → AI → Structured Save → Return DTO
    // ------------------------------------------------------------
    @PostMapping("/search-and-process")
    public ResponseEntity<ProductResponseDTO> searchProduct(@RequestBody ProductRequestDTO req) throws Exception {

        String query = req.getQuery();
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // ---------------------------------------------------------
        // 1️⃣ Get ASIN for search query
        // ---------------------------------------------------------
        List<String> asins = productService.searchAsins(query);
        if (asins.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String asin = asins.get(0);  // best match
        log.info("Selected ASIN '{}' for query '{}'", asin, query);

        // ---------------------------------------------------------
        // 2️⃣ Check RAW CACHE
        // ---------------------------------------------------------
        String cachedRaw = productService.getRawCache(asin);

        if (cachedRaw != null) {
            log.info("CACHE HIT for ASIN {}", asin);

            // Convert JSON string → Map
            Map<String, Object> rawMap = objectMapper.readValue(cachedRaw, Map.class);

            // Process product using cached RAW data
            Product product = productService.processAndSaveProduct(asin, rawMap);

            return ResponseEntity.ok(convertToDto(product));
        }

        // ---------------------------------------------------------
        // 3️⃣ CACHE MISS → Fetch fresh details from RapidAPI
        // ---------------------------------------------------------
        log.info("CACHE MISS → Fetching from RapidAPI for ASIN {}", asin);

        Map<String, Object> freshDetails = productService.fetchProductDetails(asin);

        // Save RAW JSON to cache
        RawCacheDTO dto = new RawCacheDTO();
        dto.setProductId(asin);
        dto.setRawJson(objectMapper.writeValueAsString(freshDetails));
        productService.saveRawCache(dto);

        // ---------------------------------------------------------
        // 4️⃣ Process & Save Product using fresh API data
        // ---------------------------------------------------------
        Product savedProduct = productService.processAndSaveProduct(asin, freshDetails);

        return ResponseEntity.ok(convertToDto(savedProduct));
    }




    // ------------------------------------------------------------
    // 2. Get Product Details
    // ------------------------------------------------------------
    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable String productId) {

        return productService.findByProductId(productId)
                .map(product -> ResponseEntity.ok(convertToDto(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------
    // 3. Check Product Existence
    // ------------------------------------------------------------
    @GetMapping("/exists/{productId}")
    public ResponseEntity<Boolean> checkProductExists(@PathVariable String productId) {
        return ResponseEntity.ok(productService.existsByProductId(productId));
    }




    private ProductResponseDTO convertToDto(Product product) {

        ProductResponseDTO dto = new ProductResponseDTO();

        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setBrand(product.getBrand());
        dto.setImageUrl(product.getImageUrl());
        dto.setProductLink(product.getProductLink());
        dto.setLastPrice(product.getLastPrice());
        dto.setSpecifications(product.getSpecification());  // full raw specs from RapidAPI

        return dto;
    }


    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeProductByDetails(
            @RequestBody Map<String, String> request, 
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            String productId = request.get("productId");
            String productName = request.get("productName");
            
            if (productId == null || productId.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "productId is required"));
            }

            log.info("Analyzing product: {} ({})", productName, productId);
            log.info("🔍 Authentication object: {}", authentication != null ? "Present" : "NULL");
            log.info("🔍 Authorization header: {}", authHeader != null ? "Present (Bearer token)" : "NULL");

            // 🔧 ENHANCED: Get current user with multiple methods
            User user = null;
            
            // Method 1: Try Authentication object first
            if (authentication != null && authentication.isAuthenticated()) {
                String email = authentication.getName();
                log.info("🔐 Method 1 - Authentication object present: {}", email);
                
                // Check if email looks like "anonymousUser" (Spring Security default)
                if ("anonymousUser".equals(email)) {
                    log.info("⚠ Anonymous user (Spring Security anonymous authentication)");
                    user = null;
                } else {
                    user = userRepository.findByEmail(email).orElse(null);
                    if (user == null) {
                        log.warn("❌ Authenticated user {} not found in database. Analysis will be saved without user_id.", email);
                    } else {
                        log.info("✓ User found via Authentication: {} (ID: {})", user.getEmail(), user.getId());
                    }
                }
            }
            
            // Method 2: Try JWT token from header if Authentication didn't work
            if (user == null && authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    String token = authHeader.substring(7);
                    log.info("🔐 Method 2 - Attempting to extract user from JWT token");
                    
                    // Use JwtTokenUtil to extract email from token
                    com.example.backend.security.JwtTokenUtil jwtTokenUtil = 
                        new com.example.backend.security.JwtTokenUtil(userRepository);
                    String email = jwtTokenUtil.getEmailFromToken(token);
                    
                    if (email != null && !email.equals("anonymousUser")) {
                        user = userRepository.findByEmail(email).orElse(null);
                        if (user != null) {
                            log.info("✓ User found via JWT token: {} (ID: {})", user.getEmail(), user.getId());
                        } else {
                            log.warn("❌ Email {} from JWT token not found in database", email);
                        }
                    }
                } catch (Exception e) {
                    log.error("❌ Failed to extract user from JWT token: {}", e.getMessage());
                }
            }
            
            if (user == null) {
                log.info("🔓 No user authentication - Analysis will be saved without user_id (anonymous)");
            }

            // 1️⃣ Get raw JSON from cache OR fetch if not available
            String rawJson = productService.getRawCache(productId);
            
            if (rawJson == null) {
                log.info("No cached data for {}. Fetching from API...", productId);
                
                // Fetch product details from RapidAPI
                Map<String, Object> freshDetails = productService.fetchProductDetails(productId);
                
                if (freshDetails.containsKey("error")) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", "Failed to fetch product details: " + freshDetails.get("error")));
                }
                
                // Save to cache for future use
                RawCacheDTO dto = new RawCacheDTO();
                dto.setProductId(productId);
                dto.setRawJson(objectMapper.writeValueAsString(freshDetails));
                productService.saveRawCache(dto);
                
                // Convert back to JSON string for AI processing
                rawJson = objectMapper.writeValueAsString(freshDetails);
            } else {
                log.info("Using cached data for {}", productId);
            }

            // 2️⃣ Send raw → AI Engine (or local processing if AI disabled)
            Map<String, Object> structured =
                    productService.sendRawToAiAndGetStructured(rawJson);
            
            if (structured == null || structured.isEmpty()) {
                log.error("AI service returned null or empty structured data");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to process product data"));
            }
            
            // Check if the structured data contains an error before proceeding
            if (structured.containsKey("error") && structured.get("error").equals("PROCESSING_FAILED")) {
                log.error("Processing failed: {}", structured.get("message"));
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                            "error", "Processing failed",
                            "message", structured.getOrDefault("message", "Unable to process product data")
                        ));
            }
            
            log.info("Structured data received: {}", structured.keySet());
            
            // Validate that the analyzed product matches the requested ASIN
            Object rawObj = structured.get("raw");
            if (rawObj instanceof Map) {
                Map<String, Object> rawData = (Map<String, Object>) rawObj;
                String actualAsin = (String) rawData.get("asin");
                if (actualAsin != null && !actualAsin.equals(productId)) {
                    log.warn("ASIN mismatch: requested={}, got={}", productId, actualAsin);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of(
                                "error", "Product mismatch detected",
                                "message", "The analyzed product (" + actualAsin + ") does not match the requested product (" + productId + ")"
                            ));
                }
            }

            // 3️⃣ Save the structured product to database
            log.info("Saving product with structured data. Title: {}, Brand: {}, Price: {}, ImageURL: {}", 
                structured.get("title"), structured.get("brand"), structured.get("price"), structured.get("imageUrl"));
            
            Product savedProduct = productService.processAndSaveProduct(productId, structured);
            
            if (savedProduct == null) {
                log.error("Failed to save product");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to save product"));
            }
            
            log.info("Product saved successfully. Name: {}, Brand: {}, Price: {}, ImageURL: {}", 
                savedProduct.getProductName(), savedProduct.getBrand(), 
                savedProduct.getLastPrice(), savedProduct.getImageUrl());

            // 4️⃣ Create and save analysis result
            int totalScore = 75; // Default score
            String verdict = "BUY";
            String summary = "Product analysis completed";
            String pros = "[]";
            String cons = "[]";
            
            // Extract scores from AI response if available
            if (structured.containsKey("overall_score")) {
                Object scoreObj = structured.get("overall_score");
                if (scoreObj instanceof Number) {
                    double score = ((Number) scoreObj).doubleValue();
                    totalScore = (int) (score * 100); // Convert 0-1 to 0-100
                }
            }
            
            if (structured.containsKey("decision")) {
                String decision = structured.get("decision").toString();
                verdict = decision.equals("BUY") ? "BUY" : "NOT_BUY";
            }
            
            if (structured.containsKey("reason")) {
                summary = structured.get("reason").toString();
            }
            
            // 🔧 ENHANCED: Extract pros and cons from AI response with better fallback
            try {
                log.info("🔍 Checking for pros/cons in AI response. Available keys: {}", structured.keySet());
                
                if (structured.containsKey("pros")) {
                    Object prosObj = structured.get("pros");
                    log.info("✓ Found 'pros' field: {} (type: {})", prosObj, prosObj.getClass().getSimpleName());
                    
                    if (prosObj instanceof List && !((List<?>) prosObj).isEmpty()) {
                        pros = objectMapper.writeValueAsString(prosObj);
                        log.info("✓ Serialized pros: {}", pros);
                    } else if (prosObj instanceof String && !((String) prosObj).isEmpty()) {
                        pros = (String) prosObj;
                        log.info("✓ Used string pros: {}", pros);
                    } else {
                        log.warn("⚠ Pros field is empty or unexpected type");
                        pros = "[\"Good product features\"]"; // Default fallback
                    }
                } else {
                    log.warn("⚠ No 'pros' field in AI response, using default");
                    pros = "[\"Product features are satisfactory\"]";
                }
                
                if (structured.containsKey("cons")) {
                    Object consObj = structured.get("cons");
                    log.info("✓ Found 'cons' field: {} (type: {})", consObj, consObj.getClass().getSimpleName());
                    
                    if (consObj instanceof List && !((List<?>) consObj).isEmpty()) {
                        cons = objectMapper.writeValueAsString(consObj);
                        log.info("✓ Serialized cons: {}", cons);
                    } else if (consObj instanceof String && !((String) consObj).isEmpty()) {
                        cons = (String) consObj;
                        log.info("✓ Used string cons: {}", cons);
                    } else {
                        log.warn("⚠ Cons field is empty or unexpected type");
                        cons = "[\"No major issues found\"]"; // Default fallback
                    }
                } else {
                    log.warn("⚠ No 'cons' field in AI response, using default");
                    cons = "[\"Limited information available\"]";
                }
            } catch (Exception e) {
                log.error("❌ Failed to extract pros/cons: {}", e.getMessage(), e);
                pros = "[\"Unable to extract pros\"]";
                cons = "[\"Unable to extract cons\"]";
            }
            
            // 🔧 ENHANCED: Extract key_features from AI response with comprehensive fallback
            String keyFeatures = null;
            try {
                log.info("🔍 Checking for key_features in AI response. Available keys: {}", structured.keySet());
                
                if (structured.containsKey("key_features")) {
                    Object kfObj = structured.get("key_features");
                    log.info("✓ Found 'key_features' field: {} (type: {})", kfObj, kfObj.getClass().getSimpleName());
                    
                    if (kfObj instanceof Map && !((Map<?, ?>) kfObj).isEmpty()) {
                        keyFeatures = objectMapper.writeValueAsString(kfObj);
                        log.info("✓ Serialized key_features: {}", keyFeatures);
                    } else if (kfObj instanceof String) {
                        keyFeatures = (String) kfObj;
                        log.info("✓ Used string key_features: {}", keyFeatures);
                    }
                } else if (structured.containsKey("keyFeatures")) {
                    Object kfObj = structured.get("keyFeatures");
                    log.info("✓ Found 'keyFeatures' field: {} (type: {})", kfObj, kfObj.getClass().getSimpleName());
                    
                    if (kfObj instanceof Map && !((Map<?, ?>) kfObj).isEmpty()) {
                        keyFeatures = objectMapper.writeValueAsString(kfObj);
                        log.info("✓ Serialized keyFeatures: {}", keyFeatures);
                    }
                }
                
                // Fallback: Extract from product specs if AI didn't provide
                if (keyFeatures == null || keyFeatures.equals("null")) {
                    log.info("⚠ No key_features from AI, extracting from product specs...");
                    Map<String, Object> specs = savedProduct.getSpecification();
                    
                    if (specs != null && !specs.isEmpty()) {
                        Map<String, String> extractedFeatures = new HashMap<>();
                        
                        // Try to extract from raw data if available
                        Object specRawObj = specs.get("raw");
                        Map<String, Object> rawData = (specRawObj instanceof Map) ? (Map<String, Object>) specRawObj : specs;
                        
                        // Common product specifications
                        String[] specKeys = {"RAM", "Storage", "Battery", "Display", "Screen Size", 
                                           "Processor", "CPU", "Camera", "OS", "Operating System",
                                           "Weight", "Color", "Warranty", "Brand"};
                        
                        for (String key : specKeys) {
                            if (rawData.containsKey(key) && rawData.get(key) != null) {
                                extractedFeatures.put(key, rawData.get(key).toString());
                            }
                            // Try lowercase
                            String lowerKey = key.toLowerCase();
                            if (rawData.containsKey(lowerKey) && rawData.get(lowerKey) != null) {
                                extractedFeatures.put(key, rawData.get(lowerKey).toString());
                            }
                        }
                        
                        // Add brand and price as key features
                        if (savedProduct.getBrand() != null) {
                            extractedFeatures.put("Brand", savedProduct.getBrand());
                        }
                        if (savedProduct.getLastPrice() != null) {
                            extractedFeatures.put("Price", "₹" + savedProduct.getLastPrice());
                        }
                        
                        if (!extractedFeatures.isEmpty()) {
                            keyFeatures = objectMapper.writeValueAsString(extractedFeatures);
                            log.info("✓ Created key_features from specs: {}", keyFeatures);
                        } else {
                            // Last resort: create minimal features
                            Map<String, String> minimalFeatures = new HashMap<>();
                            minimalFeatures.put("Product", savedProduct.getProductName());
                            minimalFeatures.put("Brand", savedProduct.getBrand() != null ? savedProduct.getBrand() : "N/A");
                            if (savedProduct.getLastPrice() != null) {
                                minimalFeatures.put("Price", "₹" + savedProduct.getLastPrice());
                            }
                            keyFeatures = objectMapper.writeValueAsString(minimalFeatures);
                            log.info("⚠ Created minimal key_features: {}", keyFeatures);
                        }
                    } else {
                        log.warn("⚠ No specs available, creating basic key_features");
                        Map<String, String> basicFeatures = new HashMap<>();
                        basicFeatures.put("Product", savedProduct.getProductName());
                        basicFeatures.put("Brand", savedProduct.getBrand() != null ? savedProduct.getBrand() : "N/A");
                        keyFeatures = objectMapper.writeValueAsString(basicFeatures);
                    }
                } else {
                    log.info("✓ Key features successfully extracted from AI response");
                }
            } catch (Exception e) {
                log.error("❌ Failed to extract key_features: {}", e.getMessage(), e);
                // Final fallback
                try {
                    Map<String, String> errorFallback = new HashMap<>();
                    errorFallback.put("Product", savedProduct.getProductName());
                    errorFallback.put("Status", "Features extraction failed");
                    keyFeatures = objectMapper.writeValueAsString(errorFallback);
                } catch (Exception ex) {
                    keyFeatures = "{\"error\":\"Unable to extract features\"}";
                }
            }
            
            // 🔧 Create and save analysis result with comprehensive logging
            AnalysisResult analysisResult = new AnalysisResult();
            analysisResult.setProduct(savedProduct);
            analysisResult.setUser(user); // Can be null for anonymous users
            analysisResult.setTotalScore(totalScore);
            analysisResult.setOverallScore(totalScore);
            analysisResult.setVerdict(verdict);
            analysisResult.setSummary(summary);
            analysisResult.setPros(pros);
            analysisResult.setCons(cons);
            analysisResult.setKeyFeatures(keyFeatures);
            
            // 📊 Log what we're about to save
            log.info("═══════════════════════════════════════════════════════");
            log.info("📝 ANALYSIS RESULT TO BE SAVED:");
            log.info("  Product ID: {}", savedProduct.getId());
            log.info("  Product Name: {}", savedProduct.getProductName());
            log.info("  User ID: {}", user != null ? user.getId() : "NULL (anonymous)");
            log.info("  User Email: {}", user != null ? user.getEmail() : "N/A");
            log.info("  Total Score: {}", totalScore);
            log.info("  Verdict: {}", verdict);
            log.info("  Summary Length: {} chars", summary != null ? summary.length() : 0);
            log.info("  Pros: {}", pros != null && pros.length() > 50 ? pros.substring(0, 50) + "..." : pros);
            log.info("  Cons: {}", cons != null && cons.length() > 50 ? cons.substring(0, 50) + "..." : cons);
            log.info("  Key Features: {}", keyFeatures != null && keyFeatures.length() > 100 ? keyFeatures.substring(0, 100) + "..." : keyFeatures);
            log.info("═══════════════════════════════════════════════════════");
            
            // Save to database
            analysisResult = analysisService.saveAnalysisResult(analysisResult);
            
            // 📊 Log what was actually saved
            log.info("═══════════════════════════════════════════════════════");
            log.info("✅ ANALYSIS RESULT SAVED SUCCESSFULLY:");
            log.info("  Analysis ID: {}", analysisResult.getId());
            log.info("  Product ID (in DB): {}", analysisResult.getProduct() != null ? analysisResult.getProduct().getId() : "NULL");
            log.info("  User ID (in DB): {}", analysisResult.getUser() != null ? analysisResult.getUser().getId() : "NULL");
            log.info("  Key Features (in DB): {}", analysisResult.getKeyFeatures() != null ? "SET" : "NULL");
            log.info("  Pros (in DB): {}", analysisResult.getPros() != null ? "SET" : "NULL");
            log.info("  Cons (in DB): {}", analysisResult.getCons() != null ? "SET" : "NULL");
            log.info("═══════════════════════════════════════════════════════");

            // 🔧 FIX 3: Save search history for this analysis
            try {
                if (user != null) {
                    searchHistoryService.saveSearch(user, productName != null ? productName : savedProduct.getProductName(), productId);
                    log.info("Search history saved for user: {} analyzing product: {}", user.getEmail(), productId);
                } else {
                    log.info("Skipping search history for anonymous user");
                }
            } catch (Exception e) {
                log.error("Failed to save search history: {}", e.getMessage());
                // Don't fail the whole request if search history fails
            }

            // 5️⃣ Return analysis result with analysis ID
            Map<String, Object> response = new HashMap<>();
            response.put("id", analysisResult.getId().toString());
            response.put("productId", savedProduct.getProductId());
            response.put("message", "Analysis completed successfully");
            response.put("overallScore", totalScore);
            response.put("verdict", verdict);
            response.put("data", structured);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "error", "Invalid request",
                        "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Error analyzing product: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "error", "Analysis failed",
                        "message", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred",
                        "type", e.getClass().getSimpleName()
                    ));
        }
    }

    @PostMapping("/analyze/{productId}")
    public ResponseEntity<Map<String, Object>> analyzeProduct(@PathVariable String productId) {

        try {
            // 1️⃣ Get raw JSON from cache
            String rawJson = productService.getRawCache(productId);
            if (rawJson == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "No raw data found for productId: " + productId));
            }

            // 2️⃣ Send raw → AI Engine
            Map<String, Object> structured =
                    productService.sendRawToAiAndGetStructured(rawJson);

            // 3️⃣ Return analyzed (AI output), but NOT save it
            return ResponseEntity.ok(structured);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }




}

