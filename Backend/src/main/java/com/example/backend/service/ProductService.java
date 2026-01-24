package com.example.backend.service;


import com.example.backend.DTO.cache.RawCacheDTO;
import com.example.backend.entity.Product;

import java.util.*;

public interface ProductService {

    // -------------------------------
    // Basic CRUD + lookups
    // -------------------------------
    Optional<Product> findByProductId(String productId);

    boolean existsByProductId(String productId);


    // -------------------------------
    // Raw JSON Cache Handling
    // -------------------------------


    void saveRawCache(RawCacheDTO dto);

    String getRawCache(String productId);

    // -------------------------------
    // AI -> Structured Product Processing
    // -------------------------------

    // Optional helper (used internally or by controller)
    Map<String, Object> sendRawToAiAndGetStructured(String rawJson);

    // ADD THIS at bottom inside interface, do not modify existing methods


    List<String> searchAsins(String query);

    Map<String, Object> fetchProductDetails(String asin);
    List<Map<String, Object>> fetchProductReviews(String asin);
//    Map<String, Object> fetchApifyPriceHistory(String asin);

    Product processAndSaveProduct(String asin , Map<String,Object> details);











}
