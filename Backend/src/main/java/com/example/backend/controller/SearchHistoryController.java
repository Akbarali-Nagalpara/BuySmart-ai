package com.example.backend.controller;


import com.example.backend.DTO.response.SearchHistoryDTO;
import com.example.backend.entity.SearchHistory;
import com.example.backend.entity.User;
import com.example.backend.security.JwtTokenUtil;
import com.example.backend.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search-history")
@RequiredArgsConstructor
public class SearchHistoryController {

    private final SearchHistoryService historyService;
    private final JwtTokenUtil jwtUtil;

    private User getCurrentUser(String token) {
        // decode token, fetch user — same logic you used in login
        return jwtUtil.getUserFromToken(token);
    }



    @GetMapping("/my")
    public List<SearchHistoryDTO> getMyHistory(@RequestHeader("Authorization") String auth) {

        String token = auth.replace("Bearer ", "");
        User user = getCurrentUser(token);

        List<SearchHistory> historyList = historyService.getUserHistory(user);

        return historyList.stream().map(h -> {
            SearchHistoryDTO dto = new SearchHistoryDTO();
            dto.setQuery(h.getQuery());
            dto.setExternalProductId(h.getExternalProductId());
            dto.setSearchedAt(h.getSearchedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/count/{productId}")
    public int getSearchCount(@PathVariable String productId) {
        return historyService.countSearches(productId);
    }
}

