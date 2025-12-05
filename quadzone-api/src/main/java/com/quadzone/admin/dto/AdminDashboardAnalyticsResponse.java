package com.quadzone.admin.dto;

import java.util.List;

public record AdminDashboardAnalyticsResponse(
        List<MonthlyMetric> sales,
        List<MonthlyMetric> users,
        List<MonthlyMetric> orders,
        List<MonthlyMetric> messages
) {}

