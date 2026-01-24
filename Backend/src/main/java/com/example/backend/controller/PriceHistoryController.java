package com.example.backend.controller;



import com.example.backend.DTO.price.PriceHistoryDTO;
import com.example.backend.entity.Product;
import com.example.backend.service.PriceHistoryService;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
public class PriceHistoryController {

    private final PriceHistoryService priceHistoryService;
    private final ProductService productService;

    /**
     * Get full price history for a product
     */
    @GetMapping("/{productId}/history")
    public ResponseEntity<?> getPriceHistory(@PathVariable String productId) {

        // 1️⃣ Find product
        Product product = productService.findByProductId(productId)
                .orElse(null);

        if (product == null) {
            return ResponseEntity.badRequest().body("Invalid productId");
        }

        // 2️⃣ Get price history list
        List<PriceHistoryDTO> history = priceHistoryService.getPriceHistory(productId);

        return ResponseEntity.ok(history);
    }

    /**
     * Get all-time low price for product
     */
    @GetMapping("/{productId}/low")
    public ResponseEntity<?> getAllTimeLow(@PathVariable String productId) {

        Product product = productService.findByProductId(productId)
                .orElse(null);

        if (product == null) {
            return ResponseEntity.badRequest().body("Invalid productId");
        }

        Double low = priceHistoryService.getAllTimeLow(productId);

        return ResponseEntity.ok(low);
    }

    /**
     * Get all-time high price for product
     */
    @GetMapping("/{productId}/high")
    public ResponseEntity<?> getAllTimeHigh(@PathVariable String productId) {

        Product product = productService.findByProductId(productId)
                .orElse(null);

        if (product == null) {
            return ResponseEntity.badRequest().body("Invalid productId");
        }

        Double high = priceHistoryService.getAllTimeHigh(productId);

        return ResponseEntity.ok(high);
    }

    /**
     * Get latest stored price
     */
    @GetMapping("/{productId}/latest")
    public ResponseEntity<?> getLatestPrice(@PathVariable String productId) {

        Product product = productService.findByProductId(productId)
                .orElse(null);

        if (product == null) {
            return ResponseEntity.badRequest().body("Invalid productId");
        }

        return ResponseEntity.ok(
                priceHistoryService.getLatestPrice(productId)
        );
    }
}
