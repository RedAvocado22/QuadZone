package com.quadzone.utils;

import com.quadzone.product.Product;
import com.quadzone.product.dto.ProductResponse;
import com.quadzone.user.User;
import com.quadzone.user.dto.CurrentUserResponse;
import com.quadzone.user.dto.UserResponse;
import org.springframework.stereotype.Component;
import com.quadzone.review.dto.ReviewDTO;
import com.quadzone.review.Review;

@Component
public class EntityMapper {
    public CurrentUserResponse toCurrentUserResponse(User user) {
        return CurrentUserResponse.from(user);
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.from(user);
    }

    public ProductResponse toProductResponse(Product product) {
        return ProductResponse.from(product);
    }

    public ReviewDTO toReviewDTO(Review review) {
        return ReviewDTO.from(review);
    }
}
