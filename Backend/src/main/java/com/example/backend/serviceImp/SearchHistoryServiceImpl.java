package com.example.backend.serviceImp;


import com.example.backend.entity.Product;
import com.example.backend.entity.SearchHistory;
import com.example.backend.entity.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.SearchHistoryRepository;
import com.example.backend.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchHistoryServiceImpl implements SearchHistoryService {

    private final SearchHistoryRepository historyRepository;
    private final ProductRepository productRepository;

    @Override
    public SearchHistory saveSearch(User user, String query, String externalProductId) {
        SearchHistory history = new SearchHistory();
        history.setUser(user);
        history.setQuery(query);
        history.setExternalProductId(externalProductId);
        history.setSearchedAt(LocalDateTime.now());
        
        // 🔧 FIX: Link the Product entity to populate product_id in database
        if (externalProductId != null && !externalProductId.isEmpty()) {
            productRepository.findByProductId(externalProductId).ifPresent(history::setProduct);
        }
        
        return historyRepository.save(history);
    }

    @Override
    public List<SearchHistory> getUserHistory(User user) {
        return historyRepository.findByUserOrderBySearchedAtDesc(user);
    }

    @Override
    public int countSearches(String externalProductId) {
        return historyRepository.countByExternalProductId(externalProductId);
    }

    @Override
    public List<SearchHistory> getRecentSearchesForProduct(String externalProductId) {
        return historyRepository.findByExternalProductIdOrderBySearchedAtDesc(externalProductId);
    }
}
