
package com.example.backend.serviceImp;

import com.example.backend.DTO.cache.RawCacheDTO;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductRawDataCache;
import com.example.backend.repository.ProductRawDataCacheRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.PriceHistoryService;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.*;


import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;


@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final RestTemplate restTemplate = new RestTemplate();


    private final PriceHistoryService priceHistoryService;
    @Value("${rapidapi.key}")
    private String rapidApiKey;

    @Value("${rapidapi.host}")
    private String rapidApiHost;

    @Value("${apify.api.key}")
    private String apifyApiKey;


    @Value("${rapidapi.base-url}")
    private String rapidApiBaseUrl;

    @Value("${ai.enabled:false}")
    private boolean aiEnabled;

    @Value("${ai.service.url:http://localhost:5001/analyze}")
    private String aiServiceUrl;




    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;
    private final ProductRawDataCacheRepository productRawDataCacheRepository;

    @Override
    public Optional<Product> findByProductId(String productId) {
        log.info("Finding product with ID: {}", productId);
        return productRepository.findByProductId(productId);
    }

    @Override
    public boolean existsByProductId(String productId) {
        if (productId == null || productId.isBlank()) {
            return false;
        }

        return productRepository.findByProductId(productId).isPresent();
    }


    @Override
    @Transactional
    public void saveRawCache(RawCacheDTO dto) {

        log.info("💾 Saving raw cache for productId: {}", dto.getProductId());

        // 1️⃣ Convert JSON STRING → Map
        Map<String, Object> rawMap;
        try {
            rawMap = objectMapper.readValue(dto.getRawJson(), new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            log.error("Failed to parse raw JSON for productId {}", dto.getProductId(), e);
            throw new RuntimeException("Invalid raw JSON format");
        }

        // 2️⃣ Find existing cache by external_product_id - CRITICAL to prevent duplicates
        Optional<ProductRawDataCache> existingOpt =
                productRawDataCacheRepository.findByExternalProductId(dto.getProductId());

        ProductRawDataCache cache;
        
        if (existingOpt.isPresent()) {
            // UPDATE existing cache - this prevents duplicate records
            cache = existingOpt.get();
            log.info("✓ Found existing cache entry (Cache ID: {}, Product ID: {}). UPDATING existing record...", 
                    cache.getId(), dto.getProductId());
        } else {
            // CREATE new cache entry ONLY if none exists
            cache = new ProductRawDataCache();
            cache.setExternalProductId(dto.getProductId());
            log.info("✓ Creating NEW cache entry for product: {}", dto.getProductId());
        }

        // 3️⃣ Set/Update fields - Reviews are stored in rawJson as part of the complete product data
        cache.setRawJson(rawMap); // ✔ Stores ALL data including reviews as JSONB
        cache.setCachedAt(LocalDateTime.now());
        cache.setExpiryAt(LocalDateTime.now().plusHours(12)); // Set your cache expiry
        
        // 🔧 Link cache to product if it exists in database
        Optional<Product> productOpt = productRepository.findByProductId(dto.getProductId());
        if (productOpt.isPresent()) {
            cache.setProduct(productOpt.get());
            log.info("✓ Linked cache to product (Product DB ID: {})", productOpt.get().getId());
        } else {
            cache.setProduct(null);
            log.info("⚠ Product not yet in DB. Cache saved without product_ref_id.");
        }

        // 4️⃣ Save/Update - Transaction ensures atomicity
        try {
            cache = productRawDataCacheRepository.save(cache);
            log.info("✅ Cache saved successfully - ONE RECORD per product (Cache ID: {}, External Product ID: {}, Expires: {})",
                    cache.getId(), dto.getProductId(), cache.getExpiryAt());
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Handle unique constraint violation - should not happen with our check above
            log.error("❌ DUPLICATE KEY ERROR for productId {}. This indicates a race condition.", dto.getProductId());
            // Retry by fetching again
            existingOpt = productRawDataCacheRepository.findByExternalProductId(dto.getProductId());
            if (existingOpt.isPresent()) {
                cache = existingOpt.get();
                cache.setRawJson(rawMap);
                cache.setCachedAt(LocalDateTime.now());
                cache.setExpiryAt(LocalDateTime.now().plusHours(12));
                cache = productRawDataCacheRepository.save(cache);
                log.info("✅ Recovered from race condition - updated existing cache entry");
            } else {
                throw new RuntimeException("Failed to resolve duplicate key error", e);
            }
        } catch (Exception e) {
            log.error("❌ Failed to save cache for productId {}: {}", dto.getProductId(), e.getMessage());
            throw new RuntimeException("Failed to save cache: " + e.getMessage(), e);
        }
    }



    @Override
    @Transactional
    public String getRawCache(String productId) {

        log.info("Fetching raw cache for productId: {}", productId);

        // 1️⃣ Find raw cache entry in DB
        Optional<ProductRawDataCache> cacheOpt =
                productRawDataCacheRepository.findByExternalProductId(productId);

        if (cacheOpt.isEmpty()) {
            log.info("No raw cache found for {}", productId);
            return null; // → will trigger RapidAPI fetch
        }

        ProductRawDataCache cache = cacheOpt.get();

        // 2️⃣ Check if expired
        if (cache.getExpiryAt().isBefore(LocalDateTime.now())) {
            log.info("Cache expired for {}. Deleting entry...", productId);
            productRawDataCacheRepository.delete(cache);
            return null; // → will trigger RapidAPI fetch again
        }

        // 3️⃣ Convert Map → JSON string
        try {
            return objectMapper.writeValueAsString(cache.getRawJson());
            // ✔ Correct: writeValueAsString(Map)
        } catch (Exception e) {
            log.error("Failed to convert raw JSON map to string for {}", productId, e);
            return null;
        }
    }


    @Override
    public List<String> searchAsins(String query) {

        String url = rapidApiBaseUrl + "/search"
                + "?query=" + query.replace(" ", "%20")
                + "&page=1&country=IN";

       
        // String url = rapidApiBaseUrl + "/search"
        //         + "?search=" + query.replace(" ", "%20")
        //         + "&page=1&country=IN";

        log.info("🔍 Searching products with query: '{}' at URL: {}", query, url);
        log.info("Using RapidAPI key: {}...{}", rapidApiKey.substring(0, 10), rapidApiKey.substring(rapidApiKey.length() - 5));

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("x-rapidapi-key", rapidApiKey)
                    .header("x-rapidapi-host", rapidApiHost)
                    .GET()
                    .build();

            HttpResponse<String> response =
                    HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            log.info("✓ Search API response status: {}", response.statusCode());
            log.info("Search API response body (first 800 chars): {}", 
                response.body().length() > 800 ? response.body().substring(0, 800) : response.body());

            if (response.statusCode() != 200) {
                log.error("Search API returned status code: {}, body: {}", response.statusCode(), response.body());
                if (response.statusCode() == 429) {
                    log.error("RATE LIMIT EXCEEDED (429): You are making too many requests. Please wait before trying again.");
                } else if (response.statusCode() == 403) {
                    log.error("API SUBSCRIPTION ISSUE (403): Please check your RapidAPI subscription and API key.");
                }
                log.warn("RapidAPI unavailable (status {}). Returning mock ASINs for demo purposes.", response.statusCode());
                return generateMockAsins(query);
            }

            Map<String, Object> json = objectMapper.readValue(response.body(), Map.class);

            Map<String, Object> data = (Map<String, Object>) json.get("data");
            if (data == null) {
                log.warn("No 'data' field in search response");
                return List.of();
            }

            List<Map<String, Object>> products = (List<Map<String, Object>>) data.get("products");
            if (products == null || products.isEmpty()) {
                log.warn("No products found in search response");
                return List.of();
            }

            List<String> asins = new ArrayList<>();

            for (Map<String, Object> p : products) {
                Object asin = p.get("asin");
                Object title = p.get("product_title");
                if (asin != null) {
                    asins.add(asin.toString());
                    log.info("Search result: ASIN={}, Title={}", asin, title);
                }
            }

            log.info("Found {} products for query '{}': {}", asins.size(), query, asins);
            return asins;

        } catch (Exception e) {
            log.error("Error searching ASINs for query '{}': {}", query, e.getMessage(), e);
            log.warn("Exception occurred. Returning mock ASINs for demo purposes.");
            return generateMockAsins(query);
        }
    }

    // Helper method to generate mock ASINs when RapidAPI is unavailable
    private List<String> generateMockAsins(String query) {
        log.info("Generating mock ASINs for query: {}", query);
        // Return realistic looking ASINs for demo purposes
        return List.of(
            "B0DEMO001",
            "B0DEMO002",
            "B0DEMO003",
            "B0DEMO004",
            "B0DEMO005"
        );
    }



    @Override
    public Map<String, Object> fetchProductDetails(String asin) {
        try {
            String url = rapidApiBaseUrl
                    + "/product-details"
                    + "?asin=" + asin
                    + "&country=IN";

            // String url = rapidApiBaseUrl
            //                 + "/details"
            //                 + "?asin=" + asin
            //                 + "&country=IN";


            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("x-rapidapi-key", rapidApiKey)
                    .header("x-rapidapi-host", rapidApiHost)
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            HttpResponse<String> response =
                    HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            log.info("✓ Product details API response status for ASIN {}: {}", asin, response.statusCode());
            log.info("Response body (first 500 chars): {}", 
                response.body().length() > 500 ? response.body().substring(0, 500) : response.body());
            
            if (response.statusCode() != 200) {
                log.error("Failed to fetch details for ASIN {}. Status: {}, Body: {}", 
                    asin, response.statusCode(), response.body());
                if (response.statusCode() == 429) {
                    log.error("RATE LIMIT EXCEEDED (429): Too many requests to RapidAPI.");
                } else if (response.statusCode() == 403) {
                    log.error("API SUBSCRIPTION ISSUE (403): Check RapidAPI subscription.");
                }
                log.warn("RapidAPI unavailable. Returning mock product data for ASIN: {}", asin);
                return generateMockProductDetails(asin);
            }

            // Parse JSON
            Map<String, Object> json = objectMapper.readValue(response.body(), Map.class);

            Map<String, Object> data = (Map<String, Object>) json.get("data");
            if (data == null) {
                return Map.of("error", "No data", "raw", json);
            }

            // Extract required information
            Map<String, Object> product = new LinkedHashMap<>();

            product.put("asin", asin);
            product.put("title", data.getOrDefault("product_title", ""));
            product.put("price", extractPrice(data.get("product_price")));
            product.put("imageUrl", data.getOrDefault("product_photo", ""));
            product.put("productUrl", data.getOrDefault("product_url", ""));
            product.put("brand", extractBrand(data.getOrDefault("product_title", "").toString()));
            product.put("rating", extractRating(data.get("product_star_rating")));
            product.put("reviewCount", extractReviewCount(data.get("product_num_ratings")));
            product.put("raw", data); // save full specifications

            log.info("✓ Successfully extracted product: title='{}', brand='{}', price={}", 
                product.get("title"), product.get("brand"), product.get("price"));

            return product;

        } catch (Exception e) {
            log.error("Error fetching product details for ASIN {}: {}", asin, e.getMessage());
            log.warn("Exception occurred. Returning mock product data for ASIN: {}", asin);
            return generateMockProductDetails(asin);
        }
    }

    // Helper method to generate mock product data when RapidAPI is unavailable
    private Map<String, Object> generateMockProductDetails(String asin) {
        log.info("Generating mock product data for ASIN: {}", asin);
        
        Map<String, Object> mockProduct = new LinkedHashMap<>();
        mockProduct.put("asin", asin);
        mockProduct.put("title", "Demo Product - " + asin);
        mockProduct.put("product_title", "Demo Product - " + asin);
        mockProduct.put("price", "₹999");
        mockProduct.put("product_price", "₹999");
        mockProduct.put("imageUrl", "https://via.placeholder.com/300x300.png?text=Demo+Product");
        mockProduct.put("product_photo", "https://via.placeholder.com/300x300.png?text=Demo+Product");
        mockProduct.put("productUrl", "https://www.amazon.in/dp/" + asin);
        mockProduct.put("product_url", "https://www.amazon.in/dp/" + asin);
        mockProduct.put("brand", "Demo Brand");
        mockProduct.put("rating", 4.5);
        mockProduct.put("product_star_rating", "4.5");
        mockProduct.put("reviewCount", 1234);
        mockProduct.put("product_num_ratings", 1234);
        mockProduct.put("description", "This is a demo product for testing purposes when RapidAPI is unavailable.");
        mockProduct.put("mock_data", true);
        // DO NOT add circular reference - causes infinite nesting error
        
        return mockProduct;
    }

//------------------------------------------------------
//    Helper to fetchProductDetails
//-------------------------------------------------------
    private String extractBrand(String title) {
        if (title == null) return "Unknown Brand";

        title = title.toLowerCase();

        if (title.contains("iphone") || title.contains("apple")) return "Apple";
        if (title.contains("samsung")) return "Samsung";
        if (title.contains("oneplus")) return "OnePlus";
        if (title.contains("vivo")) return "Vivo";
        if (title.contains("oppo")) return "Oppo";
        if (title.contains("xiaomi") || title.contains("redmi")) return "Xiaomi";
        if (title.contains("asus")) return "Asus";
        if (title.contains("realme")) return "Realme";
        if (title.contains("motorola") || title.contains("moto")) return "Motorola";

        return "Unknown Brand";
    }

    private Double extractPrice(Object priceObj) {
        if (priceObj == null) return 0.0;
        
        // Handle if it's already a Number
        if (priceObj instanceof Number) {
            return ((Number) priceObj).doubleValue();
        }
        
        String priceStr = priceObj.toString().trim();
        // Remove currency symbols and extra text
        priceStr = priceStr.replaceAll("[^0-9.,]", "");
        // Remove commas
        priceStr = priceStr.replace(",", "");
        
        try {
            return Double.parseDouble(priceStr);
        } catch (NumberFormatException e) {
            log.warn("Failed to parse price: {}", priceObj);
            return 0.0;
        }
    }

    private Double extractRating(Object ratingObj) {
        if (ratingObj == null) return 0.0;
        
        try {
            if (ratingObj instanceof Number) {
                return ((Number) ratingObj).doubleValue();
            }
            String ratingStr = ratingObj.toString().trim();
            // Extract first number (e.g., "4.5 out of 5" -> 4.5)
            ratingStr = ratingStr.replaceAll("[^0-9.]", "");
            return Double.parseDouble(ratingStr);
        } catch (Exception e) {
            log.warn("Failed to parse rating: {}", ratingObj);
            return 0.0;
        }
    }

    private Integer extractReviewCount(Object reviewObj) {
        if (reviewObj == null) return 0;
        
        try {
            if (reviewObj instanceof Number) {
                return ((Number) reviewObj).intValue();
            }
            String reviewStr = reviewObj.toString().trim();
            // Remove commas and non-numeric characters
            reviewStr = reviewStr.replaceAll("[^0-9]", "");
            return Integer.parseInt(reviewStr);
        } catch (Exception e) {
            log.warn("Failed to parse review count: {}", reviewObj);
            return 0;
        }
    }




    @Override
    public List<Map<String, Object>> fetchProductReviews(String asin) {
        try {
            String url = rapidApiBaseUrl
                    + "/product-reviews"
                    + "?asin=" + asin
                    + "&country=IN"
                    + "&page=1"
                    + "&sort_by=TOP_REVIEWS"
                    + "&star_rating=ALL"
                    + "&verified_purchases_only=false"
                    + "&images_or_videos_only=false"
                    + "&current_format_only=false";

            
        // String url = rapidApiBaseUrl + "/amazon/products/reviews"
        // + "?asin=" + asin;
        // // + "&country=in"
        // // + "&page=1"
        // // + "&sort_by=TOP_REVIEWS"
        // // + "&star_rating=ALL"
        // // + "&verified_purchases_only=false"
        // // + "&images_or_videos_only=false"
        // // + "&current_format_only=false";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("x-rapidapi-key", rapidApiKey)
                    .header("x-rapidapi-host", rapidApiHost)
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            HttpResponse<String> response =
                    HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Failed to fetch reviews for ASIN {}: Status {}", asin, response.statusCode());
                return List.of();
            }

            Map<String, Object> json = objectMapper.readValue(response.body(), Map.class);

            Map<String, Object> data = (Map<String, Object>) json.get("data");
            if (data == null) return List.of();

            List<Map<String, Object>> reviews = (List<Map<String, Object>>) data.get("reviews");
            if (reviews == null) return List.of();

            return reviews;

        } catch (Exception e) {
            log.error("Error fetching reviews for ASIN {}: {}", asin, e.getMessage());
            return List.of();
        }
    }


//    @Override
//    public Map<String, Object> fetchApifyPriceHistory(String asin) {
//        try {
//            String url = "https://api.apify.com/v2/acts/radeance~amazon-price-history-api/run-sync?token=" + apifyApiKey;
//
//            // Body
//            String jsonRequest = objectMapper.writeValueAsString(Map.of(
//                    "asin", asin,
//                    "domain", "IN"
//            ));
//
//            HttpRequest request = HttpRequest.newBuilder()
//                    .uri(URI.create(url))
//                    .header("Content-Type", "application/json")
//                    .POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
//                    .build();
//
//            HttpResponse<String> response =
//                    HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
//
//            if (response.statusCode() != 200) {
//                log.error("Apify Price History Failed: ASIN {}, Status {}", asin, response.statusCode());
//                return Map.of("error", "Non-200 response", "status", response.statusCode());
//            }
//
//            // Parse JSON
//            Map<String, Object> json = objectMapper.readValue(response.body(), Map.class);
//
//            return json;
//
//        } catch (Exception e) {
//            log.error("Apify Price History Error for {}: {}", asin, e.getMessage());
//            return Map.of("error", e.getMessage());
//        }
//    }










    @Override
    @Transactional
    public Product processAndSaveProduct(String asin, Map<String, Object> details) {

        if (details == null || details.isEmpty()) {
            throw new RuntimeException("No product details found for ASIN: " + asin);
        }

        // -------------------------
        // Extract basic fields
        // -------------------------
        String title = (String) details.getOrDefault("title",
                details.getOrDefault("product_title", "Unknown Product"));

        String imageUrl = (String) details.getOrDefault("imageUrl",
                details.getOrDefault("product_photo", "https://via.placeholder.com/400x400?text=No+Image"));
        
        // Ensure we have a valid image URL
        if (imageUrl == null || imageUrl.isEmpty()) {
            imageUrl = "https://via.placeholder.com/400x400?text=No+Image";
        }

        String productUrl = (String) details.getOrDefault("productUrl",
                details.getOrDefault("product_url", ""));

        // Price conversion - handle both String and Number types
        Object priceObj = details.getOrDefault("price",
                details.getOrDefault("product_price", null));
        Double price = null;
        if (priceObj instanceof Number) {
            price = ((Number) priceObj).doubleValue();
        } else if (priceObj instanceof String) {
            price = parsePrice((String) priceObj);
        }

        // Brand extraction
        String brand = extractBrand(title);

        // -------------------------
        // Prepare Specs Map
        // -------------------------
        Map<String, Object> specs = new LinkedHashMap<>(details);

        // -------------------------
        // Fetch Reviews & Merge
        // -------------------------
        List<Map<String, Object>> reviews = fetchProductReviews(asin);
        specs.put("reviews", reviews);
        specs.put("total_reviews", reviews.size());

        // -------------------------
        // Fetch Price History API & Merge
        // -------------------------
//        Map<String, Object> priceHistory = fetchApifyPriceHistory(asin);
//        specs.put("price_history", priceHistory);

        // -------------------------
        // Check if Product Exists
        // -------------------------
        Optional<Product> existingOpt = productRepository.findByProductId(asin);
        Product product;

        if (existingOpt.isPresent()) {

            // Update existing product
            product = existingOpt.get();

            product.setProductName(title);
            product.setBrand(brand);
            product.setImageUrl(imageUrl);
            product.setProductLink(productUrl);
            product.setSpecification(specs);

            Double oldPrice = product.getLastPrice();
            product.setLastPrice(price);

            // Save product BEFORE saving price history
            product = productRepository.save(product);

            // If price changed → save history
            if (price != null && (oldPrice == null || !oldPrice.equals(price))) {
                priceHistoryService.savePrice(product, price);
            }
            
            // 🔧 FIX 2: Update raw cache to link to this product if not already linked
            try {
                Optional<com.example.backend.entity.ProductRawDataCache> cacheOpt = 
                    productRawDataCacheRepository.findByExternalProductId(asin);
                if (cacheOpt.isPresent() && cacheOpt.get().getProduct() == null) {
                    com.example.backend.entity.ProductRawDataCache cache = cacheOpt.get();
                    cache.setProduct(product);
                    productRawDataCacheRepository.save(cache);
                    log.info("Updated raw cache to link to product: {}", asin);
                }
            } catch (Exception e) {
                log.warn("Failed to update raw cache product link: {}", e.getMessage());
            }

        } else {

            // Create NEW Product
            product = new Product();
            product.setProductId(asin);
            product.setProductName(title);
            product.setBrand(brand);
            product.setImageUrl(imageUrl);
            product.setProductLink(productUrl);
            product.setLastPrice(price);
            product.setSpecification(specs);

            // Save product BEFORE saving price history
            product = productRepository.save(product);

            // First price entry
            if (price != null) {
                priceHistoryService.savePrice(product, price);
            }
            
            // 🔧 FIX 2: Update raw cache to link to this new product
            try {
                Optional<com.example.backend.entity.ProductRawDataCache> cacheOpt = 
                    productRawDataCacheRepository.findByExternalProductId(asin);
                if (cacheOpt.isPresent() && cacheOpt.get().getProduct() == null) {
                    com.example.backend.entity.ProductRawDataCache cache = cacheOpt.get();
                    cache.setProduct(product);
                    productRawDataCacheRepository.save(cache);
                    log.info("Linked raw cache to new product: {}", asin);
                }
            } catch (Exception e) {
                log.warn("Failed to link raw cache to new product: {}", e.getMessage());
            }
        }

        return product;
    }








//---------------------------------------------
//Used in Above method
//---------------------------------------------

    private Double parsePrice(String priceStr) {
        if (priceStr == null) return null;

        try {
            return Double.valueOf(priceStr.replaceAll("[^0-9.]", ""));
        } catch (Exception e) {
            return null;
        }
    }


    @Override
    public Map<String, Object> sendRawToAiAndGetStructured(String rawJson) {

        if (rawJson == null || rawJson.isBlank()) {
            throw new IllegalArgumentException("rawJson cannot be null or empty");
        }

        // --------------------------------
        // AI DISABLED → LOCAL FALLBACK MODE
        // --------------------------------
        if (!aiEnabled) {
            log.info("AI disabled → using local parsing");

            try {
                Map<String, Object> rawMap = objectMapper.readValue(rawJson, Map.class);

                String title = (String) rawMap.getOrDefault("title", 
                    rawMap.getOrDefault("product_title", "Unknown Product"));
                
                Object priceObj = rawMap.get("price");
                if (priceObj == null) {
                    priceObj = rawMap.get("product_price");
                }
                
                // Get rating and review count
                Object ratingObj = rawMap.get("rating");
                if (ratingObj == null) {
                    ratingObj = rawMap.get("product_star_rating");
                }
                
                Object reviewCountObj = rawMap.get("reviewCount");
                if (reviewCountObj == null) {
                    reviewCountObj = rawMap.get("product_num_ratings");
                }

                Map<String, Object> result = new HashMap<>();
                result.put("title", title);
                result.put("productName", title);
                result.put("brand", extractBrand(title));
                result.put("price", priceObj != null ? priceObj : "N/A");
                result.put("imageUrl", rawMap.getOrDefault("imageUrl", 
                    rawMap.getOrDefault("product_photo", "")));
                result.put("productUrl", rawMap.getOrDefault("productUrl", 
                    rawMap.getOrDefault("product_url", "")));
                result.put("overall_score", 0.75);
                result.put("decision", "BUY");
                result.put("reason", "Product analysis completed using local processing. AI service is disabled.");
                result.put("pros", "[]");
                result.put("cons", "[]");
                result.put("raw", rawMap);
                result.put("aiInsights", Map.of(
                    "status", "AI_DISABLED",
                    "message", "Returned local structured data"
                ));
                
                return result;

            } catch (Exception e) {
                log.error("Local parsing failed", e);
                return Map.of(
                        "error", "LOCAL_PARSE_FAILED",
                        "message", e.getMessage()
                );
            }
        }

        // --------------------------------
        // AI ENABLED → PYTHON SERVICE CALL
        // --------------------------------
        try {
            log.info("Sending data to AI service at: {}", aiServiceUrl);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(rawJson, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    aiServiceUrl,
                    requestEntity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("AI service failed. Status: {}", response.getStatusCode());
                return Map.of(
                        "error", "AI_SERVICE_ERROR",
                        "status", response.getStatusCode().value()
                );
            }

            String body = response.getBody();
            if (body == null || body.isBlank()) {
                return Map.of(
                        "error", "AI_EMPTY_RESPONSE"
                );
            }

            log.info("AI service response received successfully");
            Map<String, Object> aiResult = objectMapper.readValue(body, Map.class);
            
            // Merge original product data with AI result to ensure all fields are present
            Map<String, Object> rawMap = objectMapper.readValue(rawJson, Map.class);
            
            // Ensure critical product fields are present in the result
            if (!aiResult.containsKey("title") || aiResult.get("title") == null) {
                aiResult.put("title", rawMap.getOrDefault("title", 
                    rawMap.getOrDefault("product_title", "Unknown Product")));
            }
            if (!aiResult.containsKey("productName") || aiResult.get("productName") == null) {
                aiResult.put("productName", rawMap.getOrDefault("title", 
                    rawMap.getOrDefault("product_title", "Unknown Product")));
            }
            if (!aiResult.containsKey("brand") || aiResult.get("brand") == null) {
                String title = (String) rawMap.getOrDefault("title", 
                    rawMap.getOrDefault("product_title", ""));
                aiResult.put("brand", extractBrand(title));
            }
            if (!aiResult.containsKey("price") || aiResult.get("price") == null) {
                Object priceObj = rawMap.get("price");
                if (priceObj == null) {
                    priceObj = rawMap.get("product_price");
                }
                aiResult.put("price", priceObj != null ? priceObj : 0.0);
            }
            if (!aiResult.containsKey("imageUrl") || aiResult.get("imageUrl") == null || 
                aiResult.get("imageUrl").toString().isEmpty()) {
                aiResult.put("imageUrl", rawMap.getOrDefault("imageUrl", 
                    rawMap.getOrDefault("product_photo", "https://via.placeholder.com/400x400?text=No+Image")));
            }
            if (!aiResult.containsKey("productUrl") || aiResult.get("productUrl") == null) {
                aiResult.put("productUrl", rawMap.getOrDefault("productUrl", 
                    rawMap.getOrDefault("product_url", "")));
            }
            
            // Ensure raw data is included
            if (!aiResult.containsKey("raw")) {
                aiResult.put("raw", rawMap);
            }
            
            log.info("Merged AI result with original product data. Image URL: {}", aiResult.get("imageUrl"));
            return aiResult;

        } catch (Exception e) {
            log.error("AI service call failed: {}", e.getMessage(), e);
            
            // Fallback to local processing if AI service fails
            log.warn("Falling back to local processing due to AI service error");
            try {
                Map<String, Object> rawMap = objectMapper.readValue(rawJson, Map.class);
                String title = (String) rawMap.getOrDefault("title", 
                    rawMap.getOrDefault("product_title", "Unknown Product"));
                
                Object priceObj = rawMap.get("price");
                if (priceObj == null) {
                    priceObj = rawMap.get("product_price");
                }
                
                // Extract rating and review count for better fallback
                Object ratingObj = rawMap.get("rating");
                if (ratingObj == null) {
                    ratingObj = rawMap.get("product_star_rating");
                }
                
                Object reviewCountObj = rawMap.get("reviewCount");
                if (reviewCountObj == null) {
                    reviewCountObj = rawMap.get("product_num_ratings");
                }

                // Return complete structured data with all required fields
                Map<String, Object> fallbackResult = new HashMap<>();
                fallbackResult.put("title", title);
                fallbackResult.put("productName", title);
                fallbackResult.put("brand", extractBrand(title));
                fallbackResult.put("price", priceObj != null ? priceObj : "N/A");
                fallbackResult.put("imageUrl", rawMap.getOrDefault("imageUrl", 
                        rawMap.getOrDefault("product_photo", "")));
                fallbackResult.put("productUrl", rawMap.getOrDefault("productUrl", 
                        rawMap.getOrDefault("product_url", "")));
                fallbackResult.put("overall_score", 0.75);
                fallbackResult.put("decision", "BUY");
                fallbackResult.put("reason", "AI service unavailable. Using local processing with basic analysis.");
                fallbackResult.put("pros", "[]");
                fallbackResult.put("cons", "[]");
                fallbackResult.put("raw", rawMap);
                
                return fallbackResult;
            } catch (Exception fallbackError) {
                log.error("Fallback processing also failed: {}", fallbackError.getMessage(), fallbackError);
                return Map.of(
                        "error", "PROCESSING_FAILED",
                        "message", "Both AI service and local processing failed: " + e.getMessage()
                );
            }
        }
    }










}