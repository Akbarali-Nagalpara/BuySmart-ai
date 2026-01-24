package com.example.backend.DTO.response;



import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SearchHistoryDTO {
    private String query;
    private String externalProductId;
    private LocalDateTime searchedAt;
}

