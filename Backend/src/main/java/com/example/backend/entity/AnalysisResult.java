package com.example.backend.entity;



import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer totalScore;       // Final score (0–100)
    private Integer overallScore;     // Alias for totalScore for frontend compatibility
    private String verdict;           // "Worth Buying", "Not Recommended"

    @Column(columnDefinition = "TEXT")
    private String summary;           // AI generated natural-language summary

    @Column(columnDefinition = "TEXT")
    private String pros;              // JSON array: ["Good battery", "Fast CPU"]

    @Column(columnDefinition = "TEXT")
    private String cons;              // JSON array: ["Weak front camera"]

    @Column(columnDefinition = "TEXT")
    private String keyFeatures;       // JSON map: {"RAM":"8GB","Battery":"5000mAh"}

    private LocalDateTime analyzedAt = LocalDateTime.now();
    private java.util.Date createdAt = new java.util.Date();  // For frontend compatibility

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = new java.util.Date();
        }
        if (this.analyzedAt == null) {
            this.analyzedAt = LocalDateTime.now();
        }
        this.overallScore = this.totalScore; // Sync fields
    }

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
