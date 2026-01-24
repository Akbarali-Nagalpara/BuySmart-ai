package com.example.backend.service;

import com.example.backend.entity.Product;
import com.example.backend.entity.ProductRawDataCache;

import java.util.Optional;

public interface ProductRawDataCacheService {

    ProductRawDataCache saveRawCache(Product product, String rawJson);

    ProductRawDataCache saveRawCache(String externalProductId, String rawJson);

    Optional<ProductRawDataCache> getLatestValidCache(String externalProductId);

    boolean hasValidCache(String externalProductId);

    void deleteExpiredCache();
}
