package com.example.backend.entity;



import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Data
@Table(name = "product_raw_data_cache", 
       uniqueConstraints = @UniqueConstraint(columnNames = "external_product_id"))
public class ProductRawDataCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Store JSONB natively in PostgreSQL
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private Map<String, Object> rawJson;

    @Column(nullable = false)
    private LocalDateTime cachedAt;

    @Column(nullable = false)
    private LocalDateTime expiryAt;

    // External product ID (e.g., Amazon ASIN, Flipkart item ID)
    @Column(name = "external_product_id", nullable = false, unique = true)
    private String externalProductId;

    // Optional link to structured product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_ref_id")
    private Product product;
}

