package com.example.backend.repository;



import com.example.backend.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
    List<PriceHistory> findByProduct_ProductIdOrderByRecordedAtDesc(String productId);

    // Latest price
    Optional<PriceHistory> findTopByProduct_ProductIdOrderByRecordedAtDesc(String productId);

    // All-time low price
    @Query("SELECT MIN(p.price) FROM PriceHistory p WHERE p.product.productId = :productId")
    Double findMinPrice(String productId);

    // All-time high price
    @Query("SELECT MAX(p.price) FROM PriceHistory p WHERE p.product.productId = :productId")
    Double findMaxPrice(String productId);
}

