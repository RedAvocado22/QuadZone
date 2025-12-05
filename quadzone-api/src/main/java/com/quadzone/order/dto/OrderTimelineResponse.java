package com.quadzone.order.dto;

import java.util.List;

public record OrderTimelineResponse(
        Long orderId,
        String orderNumber,
        List<OrderTimelineEvent> events
) {}
