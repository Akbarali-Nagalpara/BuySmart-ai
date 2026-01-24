package com.example.backend.DTO.price;



import lombok.Data;
import java.util.List;

@Data
public class PriceHistoryListDTO {

    private String productId;
    private List<PriceHistoryDTO> history;
}

