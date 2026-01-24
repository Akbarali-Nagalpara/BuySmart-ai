package com.example.backend.service;





import com.example.backend.entity.SearchHistory;
import com.example.backend.entity.User;

import java.util.List;

public interface SearchHistoryService {

    // Save a search record (user, query, productId)
    SearchHistory saveSearch(User user, String query, String externalProductId);

    // Return full search history of a user
    List<SearchHistory> getUserHistory(User user);

    // Count how many people searched for a particular product
    int countSearches(String externalProductId);

    // Get recent searches related to a product (for analytics)
    List<SearchHistory> getRecentSearchesForProduct(String externalProductId);
}


