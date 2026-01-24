package com.example.backend.controller;


import com.example.backend.DTO.cache.RawCacheDTO;
import com.example.backend.entity.ProductRawDataCache;
import com.example.backend.service.ProductRawDataCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.Optional;
@Slf4j
@RestController
@RequestMapping("/api/cache")
@RequiredArgsConstructor
public class ProductRawDataCacheController {

    private final ProductRawDataCacheService cacheService;
    private final ObjectMapper objectMapper;

    /**
     * Convert Entity → DTO
     */
    private RawCacheDTO toDTO(ProductRawDataCache cache) {
        RawCacheDTO dto = new RawCacheDTO();
        dto.setId(cache.getId());
        dto.setProductId(cache.getExternalProductId());
        dto.setRawJson(convertMapToString(cache.getRawJson())); // already Map<String,Object>
        dto.setCachedAt(cache.getCachedAt());
        dto.setExpiryAt(cache.getExpiryAt());
        return dto;
    }

    private String convertMapToString(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            log.error("Failed to convert Map to JSON String: {}", e.getMessage());
            return "{}";
        }
    }

    /**
     * Get latest valid cache for a product
     */
    @GetMapping("/{productId}")
    public ResponseEntity<?> getLatestCache(@PathVariable String productId) {

        Optional<ProductRawDataCache> cache = cacheService.getLatestValidCache(productId);

        if (cache.isEmpty()) {
            return ResponseEntity.status(404).body(
                    Map.of("message", "No valid cache found for productId: " + productId)
            );
        }

        return ResponseEntity.ok(toDTO(cache.get()));
    }

    /**
     * Check if cache exists & is not expired
     */
    @GetMapping("/{productId}/exists")
    public ResponseEntity<?> checkCache(@PathVariable String productId) {

        boolean exists = cacheService.hasValidCache(productId);

        return ResponseEntity.ok(
                Map.of(
                        "productId", productId,
                        "validCacheExists", exists
                )
        );
    }

    /**
     * Delete all expired cache entries
     */
    @DeleteMapping("/expired")
    public ResponseEntity<?> deleteExpired() {

        cacheService.deleteExpiredCache();

        return ResponseEntity.ok(
                Map.of("status", "Expired cache entries removed")
        );
    }
}

