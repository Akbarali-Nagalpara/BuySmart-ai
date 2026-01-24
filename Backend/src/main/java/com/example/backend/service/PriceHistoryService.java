package com.example.backend.service;


import com.example.backend.DTO.price.PriceHistoryDTO;
import com.example.backend.entity.PriceHistory;
import com.example.backend.entity.Product;

import java.util.List;

public interface PriceHistoryService {

    // Insert price only when changed
    PriceHistory savePrice(Product product, Double newPrice);

    PriceHistory getLatestPrice(String productId);

    List<PriceHistoryDTO> getPriceHistory(String productId);

    Double getAllTimeLow(String productId);

    Double getAllTimeHigh(String productId);
}
