package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.entity.WishlistItem;
import java.util.List;

public interface WishlistService {
    List<WishlistItem> getUserWishlist(User user);
    WishlistItem addToWishlist(User user, String productId, String analysisId);
    void removeFromWishlist(User user, Long wishlistItemId);
    boolean isInWishlist(User user, String productId);
}
