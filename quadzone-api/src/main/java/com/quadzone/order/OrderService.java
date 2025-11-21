package com.quadzone.order;

import com.quadzone.exception.order.OrderNotFoundException;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.order.dto.OrderRegisterRequest;
import com.quadzone.order.dto.OrderResponse;
import com.quadzone.order.dto.OrderUpdateRequest;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
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
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderResponse getOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        return OrderResponse.from(order);
    }

    public OrderResponse createOrder(OrderRegisterRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.userId()));

        Order order = OrderRegisterRequest.toOrder(request, user);
        return OrderResponse.from(orderRepository.save(order));
    }

    public OrderResponse updateOrder(Long id, OrderUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        order.updateFrom(request);

        return OrderResponse.from(orderRepository.save(order));
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new OrderNotFoundException(id);
        }
        orderRepository.deleteById(id);
    }

    // Admin methods
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> findOrders(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "orderDate"));

        Page<Order> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = orderRepository.search(search.trim(), pageable);
        } else {
            resultPage = orderRepository.findAll(pageable);
        }

        var orders = resultPage.stream()
                .map(OrderResponse::from)
                .toList();

        return new PagedResponse<>(
                orders,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return orderRepository.findById(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + id));
    }
}

