package com.example.backend.DTO.response;


import lombok.Data;

@Data
public class ProductBasicDTO {
    private String productId;
    private String productName;
    private String brand;
    private String imageUrl;
    private Double lastPrice;

    public ProductBasicDTO(String productId, String productName, String brand, String imageUrl, Double lastPrice) {
        this.productId = productId;
        this.productName = productName;
        this.brand = brand;
        this.imageUrl = imageUrl;
        this.lastPrice = lastPrice;
    }

    // getters/setters
}

