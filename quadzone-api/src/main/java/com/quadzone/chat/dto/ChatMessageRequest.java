package com.quadzone.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record ChatMessageRequest(

        @NotNull(message = "Room ID is required")
        Long roomId,

        @NotNull(message = "Sender ID is required")
        Long senderId,

        @NotBlank(message = "Message content cannot be empty")
        String content
) {}
