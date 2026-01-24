package com.example.backend.DTO.response;

import java.util.Map;

public class ProductResponseDTO {

    private String productId;
    private String productName;
    private String brand;
    private String productLink;
    private String imageUrl;
    private Double lastPrice;

    private Map<String, Object> specifications; // final structured specifications
    private Map<String, Object> aiInsights;      // score, summary, weaknesses, strengths

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getProductLink() { return productLink; }
    public void setProductLink(String productLink) { this.productLink = productLink; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getLastPrice() { return lastPrice; }
    public void setLastPrice(Double lastPrice) { this.lastPrice = lastPrice; }

    public Map<String, Object> getSpecifications() { return specifications; }
    public void setSpecifications(Map<String, Object> specifications) { this.specifications = specifications; }

    public Map<String, Object> getAiInsights() { return aiInsights; }
    public void setAiInsights(Map<String, Object> aiInsights) { this.aiInsights = aiInsights; }
}

