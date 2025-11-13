package com.quadzone.review.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private long id;

    @NotBlank
    private int rating;

    private String reviewTitle;
    private String reviewText;
    private LocalDateTime updateAt;
    private LocalDateTime createdAt;
    private String productName;
    private String userName;

}
