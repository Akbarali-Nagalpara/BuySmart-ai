package com.example.backend.DTO.price;



import lombok.Data;

@Data
public class PriceRangeDTO {

    private String productId;
    private Double currentPrice;
    private Double allTimeLow;
    private Double allTimeHigh;
}

