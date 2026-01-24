package com.example.backend.controller;

import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.User;
import com.example.backend.repository.AnalysisResultRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WishlistItemRepository;
import com.example.backend.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.Calendar;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final WishlistItemRepository wishlistItemRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        // Try to get user from authentication or JWT token
        User user = getUserFromAuthOrToken(authentication, authHeader);
        
        if (user == null) {
            // Return empty stats for unauthenticated users
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalAnalyses", 0);
            stats.put("buyRecommendations", 0);
            stats.put("notBuyRecommendations", 0);
            stats.put("averageScore", 0);
            stats.put("wishlistCount", 0);
            stats.put("totalComparisons", 0);
            stats.put("avgResponseTime", 5);
            stats.put("thisWeekCount", 0);
            stats.put("thisMonthCount", 0);
            stats.put("lastWeekCount", 0);
            stats.put("lastMonthCount", 0);
            return ResponseEntity.ok(stats);
        }
        
        // Get user-specific analyses
        List<AnalysisResult> allAnalyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user);
        
        // Calculate time boundaries
        Calendar cal = Calendar.getInstance();
        Date now = cal.getTime();
        
        // This week (last 7 days)
        cal.add(Calendar.DAY_OF_MONTH, -7);
        Date weekAgo = cal.getTime();
        
        // Last week (7-14 days ago)
        cal.add(Calendar.DAY_OF_MONTH, -7);
        Date twoWeeksAgo = cal.getTime();
        
        // This month (last 30 days)
        cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -30);
        Date monthAgo = cal.getTime();
        
        // Last month (30-60 days ago)
        cal.add(Calendar.DAY_OF_MONTH, -30);
        Date twoMonthsAgo = cal.getTime();
        
        long totalAnalyses = allAnalyses.size();
        long buyRecommendations = allAnalyses.stream()
                .filter(a -> "BUY".equalsIgnoreCase(a.getVerdict()))
                .count();
        long notBuyRecommendations = totalAnalyses - buyRecommendations;
        
        double averageScore = allAnalyses.stream()
                .mapToDouble(AnalysisResult::getOverallScore)
                .average()
                .orElse(0.0);
                
        // Get wishlist count
        long wishlistCount = wishlistItemRepository.findByUserOrderByAddedAtDesc(user).size();
        
        // Count comparisons (analyses with same user in similar time frame)
        long totalComparisons = allAnalyses.size() / 3; // Rough estimate
        
        // Time-based counts
        long thisWeekCount = allAnalyses.stream()
                .filter(a -> a.getCreatedAt() != null && a.getCreatedAt().after(weekAgo))
                .count();
                
        long lastWeekCount = allAnalyses.stream()
                .filter(a -> a.getCreatedAt() != null && 
                           a.getCreatedAt().after(twoWeeksAgo) && 
                           a.getCreatedAt().before(weekAgo))
                .count();
                
        long thisMonthCount = allAnalyses.stream()
                .filter(a -> a.getCreatedAt() != null && a.getCreatedAt().after(monthAgo))
                .count();
                
        long lastMonthCount = allAnalyses.stream()
                .filter(a -> a.getCreatedAt() != null && 
                           a.getCreatedAt().after(twoMonthsAgo) && 
                           a.getCreatedAt().before(monthAgo))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAnalyses", totalAnalyses);
        stats.put("buyRecommendations", buyRecommendations);
        stats.put("notBuyRecommendations", notBuyRecommendations);
        stats.put("averageScore", Math.round(averageScore));
        stats.put("wishlistCount", wishlistCount);
        stats.put("totalComparisons", totalComparisons);
        stats.put("avgResponseTime", 5); // Mock value: 5 seconds average
        stats.put("thisWeekCount", thisWeekCount);
        stats.put("thisMonthCount", thisMonthCount);
        stats.put("lastWeekCount", lastWeekCount);
        stats.put("lastMonthCount", lastMonthCount);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentAnalyses(
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        // Try to get user from authentication or JWT token
        User user = getUserFromAuthOrToken(authentication, authHeader);
        
        if (user == null) {
            // Return empty list for unauthenticated users
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        // Get user-specific analyses
        List<AnalysisResult> recentAnalyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> response = recentAnalyses.stream()
                .map(analysis -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", analysis.getId().toString());
                    item.put("productName", analysis.getProduct().getProductName());
                    item.put("score", analysis.getOverallScore());
                    item.put("verdict", analysis.getVerdict());
                    item.put("date", getRelativeTime(analysis.getCreatedAt()));
                    
                    // Add product image
                    String imageUrl = analysis.getProduct().getImageUrl();
                    if (imageUrl == null || imageUrl.isEmpty()) {
                        imageUrl = "https://via.placeholder.com/400x400?text=No+Image";
                    }
                    item.put("imageUrl", imageUrl);
                    
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private String getRelativeTime(Date date) {
        if (date == null) return "Unknown";
        
        long diff = System.currentTimeMillis() - date.getTime();
        long seconds = diff / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;

        if (days > 0) return days + (days == 1 ? " day ago" : " days ago");
        if (hours > 0) return hours + (hours == 1 ? " hour ago" : " hours ago");
        if (minutes > 0) return minutes + (minutes == 1 ? " minute ago" : " minutes ago");
        return "Just now";
    }

    @GetMapping("/chart")
    public ResponseEntity<List<Map<String, Object>>> getChartData(
            Authentication authentication,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        User user = getUserFromAuthOrToken(authentication, authHeader);
        
        if (user == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        List<AnalysisResult> allAnalyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user);
        
        // Get last 30 days of data
        Calendar cal = Calendar.getInstance();
        List<Map<String, Object>> chartData = new ArrayList<>();
        
        for (int i = 29; i >= 0; i--) {
            cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, -i);
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            Date startOfDay = cal.getTime();
            
            cal.set(Calendar.HOUR_OF_DAY, 23);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            Date endOfDay = cal.getTime();
            
            // Count analyses for this day
            long dayAnalyses = allAnalyses.stream()
                .filter(a -> a.getCreatedAt() != null && 
                           a.getCreatedAt().after(startOfDay) && 
                           a.getCreatedAt().before(endOfDay))
                .count();
                
            long buyCount = allAnalyses.stream()
                .filter(a -> a.getCreatedAt() != null && 
                           a.getCreatedAt().after(startOfDay) && 
                           a.getCreatedAt().before(endOfDay) &&
                           "BUY".equalsIgnoreCase(a.getVerdict()))
                .count();
                
            long notBuyCount = dayAnalyses - buyCount;
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", String.format("%02d/%02d", 
                cal.get(Calendar.MONTH) + 1, 
                cal.get(Calendar.DAY_OF_MONTH)));
            dayData.put("total", dayAnalyses);
            dayData.put("buy", buyCount);
            dayData.put("notBuy", notBuyCount);
            
            chartData.add(dayData);
        }
        
        return ResponseEntity.ok(chartData);
    }

    private User getUserFromAuthOrToken(Authentication authentication, String authHeader) {
        User user = null;
        
        // Method 1: Try Authentication object
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            if (email != null && !"anonymousUser".equals(email)) {
                user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    log.info("User found via Authentication: {}", user.getEmail());
                    return user;
                }
            }
        }
        
        // Method 2: Try JWT token from header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtTokenUtil.getEmailFromToken(token);
                
                if (email != null && !"anonymousUser".equals(email)) {
                    user = userRepository.findByEmail(email).orElse(null);
                    if (user != null) {
                        log.info("User found via JWT token: {}", user.getEmail());
                    }
                }
            } catch (Exception e) {
                log.error("Failed to extract user from JWT token: {}", e.getMessage());
            }
        }
        
        return user;
    }
}
