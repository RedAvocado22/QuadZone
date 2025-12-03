package com.quadzone.utils;

import com.quadzone.blog.Blog;
import com.quadzone.blog.dto.BlogOverviewResponse;
import com.quadzone.product.Product;
import com.quadzone.product.category.sub_category.SubCategory;
import com.quadzone.product.category.sub_category.dto.SubCategoryResponse;
import com.quadzone.product.dto.ProductDetailsResponse;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductResponse;
import com.quadzone.review.Review;
import com.quadzone.review.dto.ReviewResponse;
import com.quadzone.user.User;
import com.quadzone.user.dto.CurrentUserResponse;
import com.quadzone.user.dto.UserAdminResponse;
import com.quadzone.user.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {
    public CurrentUserResponse toCurrentUserResponse(User user) {
        return CurrentUserResponse.from(user);
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.from(user);
    }
    public UserAdminResponse toUserAdminResponse(User user)
    {
        return UserAdminResponse.from(user);
    }

    public ProductResponse toProductResponse(Product product) {
        return ProductResponse.from(product);
    }
    public Product toProduct(ProductRegisterRequest  product) {
        return ProductRegisterRequest.toProduct(product);
    }
    public ReviewResponse toReviewResponse(Review review) {
        return ReviewResponse.from(review);
    }
    public ProductDetailsResponse toProductDetailsResponse(Product product) {
        return ProductDetailsResponse.from(product);
    }

    public BlogOverviewResponse toBlogResponse(Blog blog) {
        return BlogOverviewResponse.from(blog);
    }
}
