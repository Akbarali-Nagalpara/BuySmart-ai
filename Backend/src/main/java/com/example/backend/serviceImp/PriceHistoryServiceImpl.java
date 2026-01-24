package com.example.backend.serviceImp;




import com.example.backend.DTO.price.PriceHistoryDTO;
import com.example.backend.entity.PriceHistory;
import com.example.backend.entity.Product;
import com.example.backend.repository.PriceHistoryRepository;
import com.example.backend.service.PriceHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PriceHistoryServiceImpl implements PriceHistoryService {

    private final PriceHistoryRepository priceHistoryRepository;

    @Override
    public PriceHistory savePrice(Product product, Double newPrice) {

        // get last saved price
        PriceHistory latest = getLatestPrice(product.getProductId());

        // insert only when price changes
        if (latest != null && latest.getPrice().equals(newPrice)) {
            return latest;   // No change → no need to store
        }

        // Save new price record
        PriceHistory history = new PriceHistory();
        history.setProduct(product);
        history.setPrice(newPrice);
        history.setRecordedAt(LocalDateTime.now());

        return priceHistoryRepository.save(history);
    }

    @Override
    public PriceHistory getLatestPrice(String productId) {
        return priceHistoryRepository
                .findTopByProduct_ProductIdOrderByRecordedAtDesc(productId)
                .orElse(null);
    }

    @Override
    public List<PriceHistoryDTO> getPriceHistory(String productId) {

        List<PriceHistory> list =
                priceHistoryRepository.findByProduct_ProductIdOrderByRecordedAtDesc(productId);

        return list.stream()
                .map(p -> new PriceHistoryDTO(
                        p.getPrice(),
                        p.getRecordedAt()   // <-- FIXED
                ))
                .toList();
    }


    @Override
    public Double getAllTimeLow(String productId) {
        return priceHistoryRepository.findMinPrice(productId);
    }

    @Override
    public Double getAllTimeHigh(String productId) {
        return priceHistoryRepository.findMaxPrice(productId);
    }
}
