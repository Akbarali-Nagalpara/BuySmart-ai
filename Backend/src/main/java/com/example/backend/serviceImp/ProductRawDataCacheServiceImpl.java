package com.example.backend.serviceImp;

import com.example.backend.entity.Product;
import com.example.backend.entity.ProductRawDataCache;
import com.example.backend.repository.ProductRawDataCacheRepository;
import com.example.backend.service.ProductRawDataCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductRawDataCacheServiceImpl implements ProductRawDataCacheService {

    private final ProductRawDataCacheRepository cacheRepository;
    private final ObjectMapper objectMapper;

    @Override
    public ProductRawDataCache saveRawCache(Product product, String rawJson) {
        try {
            // Convert JSON string → Map<String, Object>
            Map<String, Object> jsonMap = objectMapper.readValue(rawJson, Map.class);

            ProductRawDataCache cache = new ProductRawDataCache();
            cache.setExternalProductId(product.getProductId());
            cache.setProduct(product);
            cache.setRawJson(jsonMap);  // <-- fixed ✔
            cache.setCachedAt(LocalDateTime.now());
            cache.setExpiryAt(LocalDateTime.now().plusDays(1));

            return cacheRepository.save(cache);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse raw JSON into Map", e);
        }
    }


    @Override
    public ProductRawDataCache saveRawCache(String externalProductId, String rawJson) {
        Map<String, Object> jsonMap;

        try {
            jsonMap = objectMapper.readValue(rawJson, Map.class);
        } catch (Exception e) {
            // Fallback storage
            jsonMap = Map.of("rawString", rawJson);
        }

        ProductRawDataCache cache = new ProductRawDataCache();
        cache.setExternalProductId(externalProductId);
        cache.setRawJson(jsonMap);
        cache.setCachedAt(LocalDateTime.now());
        cache.setExpiryAt(LocalDateTime.now().plusDays(1));

        return cacheRepository.save(cache);
    }


    @Override
    public Optional<ProductRawDataCache> getLatestValidCache(String externalProductId) {
        return cacheRepository
                .findFirstByExternalProductIdAndExpiryAtAfterOrderByCachedAtDesc(
                        externalProductId,
                        LocalDateTime.now()
                );
    }

    @Override
    public boolean hasValidCache(String externalProductId) {
        return getLatestValidCache(externalProductId).isPresent();
    }

    @Override
    public void deleteExpiredCache() {
        LocalDateTime now = LocalDateTime.now();
        List<ProductRawDataCache> all = cacheRepository.findAll();
        all.stream()
                .filter(c -> c.getExpiryAt() != null && c.getExpiryAt().isBefore(now))
                .forEach(cacheRepository::delete);
    }
}
