package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double price;

    private LocalDateTime recordedAt;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}

