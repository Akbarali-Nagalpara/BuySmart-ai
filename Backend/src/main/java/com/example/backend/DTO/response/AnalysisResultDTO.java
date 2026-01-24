package com.example.backend.DTO.response;


import com.example.backend.entity.Product;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnalysisResultDTO {
    private Long id;
    private Integer totalScore;
    private String verdict;
    private String summary;
    private String Pron;
    private String Cons;
    private LocalDateTime analyzedAt;
    private Product product;
}

