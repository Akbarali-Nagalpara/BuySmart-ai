package com.example.backend.DTO.request;


import lombok.Data;

@Data
public class AnalysisRequestDTO {
    private String productId;    // product to link analysis
    private Integer totalScore;
    private String verdict;
    private String summary;
}

