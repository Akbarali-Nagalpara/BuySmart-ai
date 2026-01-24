package com.example.backend.repository;

import com.example.backend.entity.SearchHistory;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserOrderBySearchedAtDesc(User user);

    int countByExternalProductId(String externalProductId);

    List<SearchHistory> findByExternalProductIdOrderBySearchedAtDesc(String externalProductId);
}

