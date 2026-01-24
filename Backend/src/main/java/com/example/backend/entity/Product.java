package com.example.backend.entity;

import com.example.backend.util.JsonToMapConverter;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String productId;   // API / unique product identifier

    private String productName;
    private String brand;

    @Column(columnDefinition = "TEXT")
    private String productLink;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private Double lastPrice;

    @Convert(converter = JsonToMapConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Object> specification;

    // Relationships

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<SearchHistory> searchHistoryList;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<PriceHistory> priceHistoryList;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<AnalysisResult> analysisResults;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductRawDataCache> rawDataCacheList;
}
