package com.example.backend.serviceImp;


import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.Product;
import com.example.backend.repository.AnalysisResultRepository;
import com.example.backend.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnalysisServiceImpl implements AnalysisService {

    private final AnalysisResultRepository analysisRepo;

    @Override
    public AnalysisResult saveAnalysis(Product product, Integer score, String verdict, String summary) {

        AnalysisResult result = new AnalysisResult();
        result.setProduct(product);
        result.setTotalScore(score);
        result.setVerdict(verdict);
        result.setSummary(summary);
        result.setAnalyzedAt(LocalDateTime.now());

        return analysisRepo.save(result);
    }
    
    @Override
    public AnalysisResult saveAnalysisResult(AnalysisResult analysisResult) {
        if (analysisResult.getAnalyzedAt() == null) {
            analysisResult.setAnalyzedAt(LocalDateTime.now());
        }
        return analysisRepo.save(analysisResult);
    }

    @Override
    public Optional<AnalysisResult> findById(Long id) {
        return analysisRepo.findById(id);
    }

    @Override
    public AnalysisResult getLatestAnalysis(String productId) {
        return analysisRepo.findTopByProduct_ProductIdOrderByAnalyzedAtDesc(productId)
                .orElse(null);
    }
    
    @Override
    public Optional<AnalysisResult> getLatestAnalysisForProduct(String productId) {
        return analysisRepo.findTopByProduct_ProductIdOrderByAnalyzedAtDesc(productId);
    }

    @Override
    public List<AnalysisResult> getAnalysisHistory(String productId) {
        return analysisRepo.findByProduct_ProductIdOrderByAnalyzedAtDesc(productId);
    }

    @Override
    public List<AnalysisResult> getAll() {
        return analysisRepo.findAll();
    }

    @Override
    public void deleteById(Long id) {
        analysisRepo.deleteById(id);
    }
}
