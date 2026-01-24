package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "wishlist_items")
public class WishlistItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(name = "added_at")
    private LocalDateTime addedAt;
    
    @Column(name = "price_at_addition")
    private Double priceAtAddition;
    
    @Column(name = "notify_on_price_drop")
    private Boolean notifyOnPriceDrop = true;
    
    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }
}
