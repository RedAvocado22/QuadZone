package com.quadzone.utils;

import com.quadzone.product.Product;
import com.quadzone.product.dto.ProductDetailsResponse;
import com.quadzone.product.dto.ProductResponse;
import com.quadzone.user.User;
import com.quadzone.user.dto.CurrentUserResponse;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {
    public CurrentUserResponse toCurrentUserResponse(User user) {
        return CurrentUserResponse.from(user);
    }

    public ProductResponse toProductResponse(Product product) {
        return ProductResponse.from(product);
    }

    public ProductDetailsResponse toProductDetailsResponse(Product product) {
        return ProductDetailsResponse.from(product);
    }
}
