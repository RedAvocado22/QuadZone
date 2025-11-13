package com.quadzone.utils;

import com.quadzone.review.Review;
import com.quadzone.review.dto.ReviewDTO;
import com.quadzone.user.User;
import com.quadzone.user.dto.CurrentUserResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ObjectMapper {
    @PersistenceContext
    private EntityManager em;

    public CurrentUserResponse toCurrentUserResponse(User user) {
        // NOTE: User lấy từ spring security bị detached nên phải dùng cái của nợ này để
        // merge lại vào.
        return CurrentUserResponse.from(em.merge(user));
    }

    public ReviewDTO toReviewDTO(Review review) {
        if (review == null)
            return null;
        Review managed = em.merge(review);
        return ReviewDTO.builder()
                .id(managed.getId() == null ? 0L : managed.getId())
                .rating(managed.getRating() == null ? 0 : managed.getRating())
                .reviewTitle(managed.getReviewTitle())
                .reviewText(managed.getReviewText())
                .createdAt(managed.getCreatedAt())
                .updateAt(managed.getUpdatedAt())
                .productName(managed.getProduct() != null ? managed.getProduct().getName() : null)
                .userName(managed.getUser() != null ? managed.getUser().getFullName() : null)
                .build();
    }

}
