package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "user_settings")
public class UserSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    @Column(name = "email_notifications")
    private Boolean emailNotifications = true;
    
    @Column(name = "price_alerts")
    private Boolean priceAlerts = true;
    
    @Column(name = "weekly_digest")
    private Boolean weeklyDigest = false;
    
    @Column(name = "theme")
    private String theme = "light"; // light or dark
    
    @Column(name = "language")
    private String language = "en";
}
