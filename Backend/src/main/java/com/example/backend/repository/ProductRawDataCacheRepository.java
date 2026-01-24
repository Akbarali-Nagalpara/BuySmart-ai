package com.example.backend.repository;



import com.example.backend.entity.ProductRawDataCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRawDataCacheRepository extends JpaRepository<ProductRawDataCache, Long> {

    /**
     * Find latest valid (non expired) cache for given external product ID
     */
    Optional<ProductRawDataCache> findFirstByExternalProductIdAndExpiryAtAfterOrderByCachedAtDesc(
            String externalProductId,
            LocalDateTime now
    );

    Optional<ProductRawDataCache> findByExternalProductId(String externalProductId);
    /**
     * Get all cache entries for debugging / admin panel
     */
    List<ProductRawDataCache> findByExternalProductIdOrderByCachedAtDesc(String externalProductId);
}


