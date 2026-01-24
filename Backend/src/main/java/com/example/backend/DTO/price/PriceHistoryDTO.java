package com.example.backend.DTO.price;



import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PriceHistoryDTO {

    private Double price;
    private LocalDateTime recordedAt;
}

