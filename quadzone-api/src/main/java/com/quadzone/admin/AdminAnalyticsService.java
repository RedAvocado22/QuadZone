package com.quadzone.admin;

import com.quadzone.admin.dto.AdminDashboardAnalyticsResponse;
import com.quadzone.admin.dto.MonthlyMetric;
import com.quadzone.payment.PaymentRepository;
import com.quadzone.payment.PaymentStatus;
import com.quadzone.user.UserRepository;
import com.quadzone.order.OrderRepository;
import com.quadzone.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ChatMessageRepository chatMessageRepository;

    public AdminDashboardAnalyticsResponse getDashboardAnalytics(int months) {
        int m = Math.max(1, Math.min(months, 24));
        LocalDate startMonth = LocalDate.now().minusMonths(m - 1).withDayOfMonth(1);
        LocalDate endMonth = LocalDate.now().withDayOfMonth(1);
        LocalDateTime from = startMonth.atStartOfDay();
        LocalDateTime to = endMonth.plusMonths(1).atStartOfDay().minusSeconds(1);

        List<Object[]> salesAgg = paymentRepository.aggregateMonthlySales(PaymentStatus.COMPLETED, from, to);
        List<Object[]> usersAgg = userRepository.aggregateMonthlyUsers(from, to);
        List<Object[]> ordersAgg = orderRepository.aggregateMonthlyOrders(from, to);
        List<Object[]> messagesAgg = chatMessageRepository.aggregateMonthlyMessages(from, to);

        Map<String, Double> salesMap = toMapDouble(salesAgg);
        Map<String, Double> usersMap = toMapDouble(usersAgg);
        Map<String, Double> ordersMap = toMapDouble(ordersAgg);
        Map<String, Double> messagesMap = toMapDouble(messagesAgg);

        List<MonthlyMetric> sales = new ArrayList<>();
        List<MonthlyMetric> users = new ArrayList<>();
        List<MonthlyMetric> orders = new ArrayList<>();
        List<MonthlyMetric> messages = new ArrayList<>();

        LocalDate cursor = startMonth;
        for (int i = 0; i < m; i++) {
            int y = cursor.getYear();
            int mo = cursor.getMonthValue();
            String key = y + "-" + String.format("%02d", mo);
            String label = Month.of(mo).name().substring(0, 1) + Month.of(mo).name().substring(1).toLowerCase() + " " + y;
            sales.add(new MonthlyMetric(y, mo, label, salesMap.getOrDefault(key, 0.0)));
            users.add(new MonthlyMetric(y, mo, label, usersMap.getOrDefault(key, 0.0)));
            orders.add(new MonthlyMetric(y, mo, label, ordersMap.getOrDefault(key, 0.0)));
            messages.add(new MonthlyMetric(y, mo, label, messagesMap.getOrDefault(key, 0.0)));
            cursor = cursor.plusMonths(1);
        }

        return new AdminDashboardAnalyticsResponse(sales, users, orders, messages);
    }

    private Map<String, Double> toMapDouble(List<Object[]> rows) {
        Map<String, Double> map = new HashMap<>();
        for (Object[] r : rows) {
            int y = ((Number) r[0]).intValue();
            int m = ((Number) r[1]).intValue();
            double v = ((Number) r[2]).doubleValue();
            map.put(y + "-" + String.format("%02d", m), v);
        }
        return map;
    }
}
