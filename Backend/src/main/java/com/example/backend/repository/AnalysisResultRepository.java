package com.example.backend.repository;


import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    Optional<AnalysisResult> findTopByProduct_ProductIdOrderByAnalyzedAtDesc(String productId);

    List<AnalysisResult> findByProduct_ProductIdOrderByAnalyzedAtDesc(String productProductId);
    
    List<AnalysisResult> findByUserOrderByCreatedAtDesc(User user);
    
    List<AnalysisResult> findByProductAndUserOrderByAnalyzedAtDesc(Product product, User user);
    
    long countByUser(User user);
}

