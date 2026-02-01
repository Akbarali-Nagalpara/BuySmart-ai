package com.example.backend.service;





import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.Product;

import java.util.List;
import java.util.Optional;

public interface AnalysisService {

    // Run new analysis (AI will be called)
    AnalysisResult saveAnalysis(Product product, Integer score, String verdict, String summary);
    
    // Save analysis result entity
    AnalysisResult saveAnalysisResult(AnalysisResult analysisResult);

    // Get analysis by ID
    Optional<AnalysisResult> findById(Long id);

    // Get latest analysis
    AnalysisResult getLatestAnalysis(String productId);
    
    // Get latest analysis as Optional
    Optional<AnalysisResult> getLatestAnalysisForProduct(String productId);

    // Get full history
    List<AnalysisResult> getAnalysisHistory(String productId);

    // Debug: get all
    List<AnalysisResult> getAll();

    // Delete analysis by ID
    void deleteById(Long id);
}


