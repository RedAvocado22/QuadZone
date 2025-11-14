package com.quadzone.admin.service;

import com.quadzone.admin.dto.AdminOrderResponse;
import com.quadzone.admin.dto.PagedResponse;
import com.quadzone.order.Order;
import com.quadzone.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminOrderService {

    private final OrderRepository orderRepository;

    public PagedResponse<AdminOrderResponse> findOrders(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "orderDate"));

        Page<Order> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = orderRepository.search(search.trim(), pageable);
        } else {
            resultPage = orderRepository.findAll(pageable);
        }

        var orders = resultPage.stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(
                orders,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    public AdminOrderResponse findById(Long id) {
        return orderRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + id));
    }

    private AdminOrderResponse toResponse(Order order) {
        var user = order.getUser();
        var customerName = user != null ? user.getFullName() : "Guest";
        int itemsCount = order.getOrderItems() != null ? order.getOrderItems().size() : 0;
        return new AdminOrderResponse(
                order.getId(),
                "ORD-" + String.format("%05d", order.getId()),
                customerName,
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getOrderDate(),
                itemsCount
        );
    }
}

