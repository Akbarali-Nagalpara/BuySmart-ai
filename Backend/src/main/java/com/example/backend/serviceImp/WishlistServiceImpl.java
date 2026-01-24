package com.example.backend.serviceImp;

import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.entity.WishlistItem;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.WishlistItemRepository;
import com.example.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;

    @Override
    public List<WishlistItem> getUserWishlist(User user) {
        return wishlistItemRepository.findByUserOrderByAddedAtDesc(user);
    }

    @Override
    @Transactional
    public WishlistItem addToWishlist(User user, String productId, String analysisId) {
        // Check if already in wishlist
        if (wishlistItemRepository.existsByUserAndProductProductId(user, productId)) {
            throw new RuntimeException("Product already in wishlist");
        }

        // Find the product
        Product product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Create wishlist item
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setUser(user);
        wishlistItem.setProduct(product);
        wishlistItem.setPriceAtAddition(product.getLastPrice());
        wishlistItem.setNotifyOnPriceDrop(true);

        return wishlistItemRepository.save(wishlistItem);
    }

    @Override
    @Transactional
    public void removeFromWishlist(User user, Long wishlistItemId) {
        WishlistItem item = wishlistItemRepository.findById(wishlistItemId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));
        
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this item");
        }

        wishlistItemRepository.delete(item);
    }

    @Override
    public boolean isInWishlist(User user, String productId) {
        return wishlistItemRepository.existsByUserAndProductProductId(user, productId);
    }
}
