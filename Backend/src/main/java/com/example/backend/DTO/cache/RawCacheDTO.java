package com.example.backend.DTO.cache;

import com.example.backend.entity.Product;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RawCacheDTO {
    private Long id;
    private String productId;
    private Product product;
    private String rawJson;
    private LocalDateTime cachedAt;
    private LocalDateTime expiryAt;
}

