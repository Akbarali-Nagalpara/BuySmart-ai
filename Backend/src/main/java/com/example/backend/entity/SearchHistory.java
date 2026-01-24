package com.example.backend.entity;



import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who searched?
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // What user typed or pasted
    private String query;

    // Which product this resulted in (if identified)
    private String externalProductId;  // same as product.productId

    private LocalDateTime searchedAt;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

}
