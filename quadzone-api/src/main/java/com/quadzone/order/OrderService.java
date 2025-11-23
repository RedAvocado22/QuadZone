package com.quadzone.order;

import com.quadzone.exception.order.OrderNotFoundException;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.order.dto.CheckoutRequest;
import com.quadzone.order.dto.OrderRegisterRequest;
import com.quadzone.order.dto.OrderResponse;
import com.quadzone.order.dto.OrderStatusResponse;
import com.quadzone.order.dto.OrderUpdateRequest;
import com.quadzone.payment.Payment;
import com.quadzone.payment.PaymentMethod;
import com.quadzone.payment.PaymentRepository;
import com.quadzone.payment.PaymentStatus;
import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.user.User;
import com.quadzone.user.UserRepository;
import com.quadzone.utils.email.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final EmailSenderService emailSenderService;

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

    /**
     * Checkout method that supports both guest and authenticated users
     * @param request Checkout request containing customer info and order items
     * @return OrderResponse with created order
     */
    public OrderResponse checkout(CheckoutRequest request) {
        // Check if user is authenticated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = null;
        
        if (authentication != null && 
            authentication.isAuthenticated() && 
            !authentication.getName().equals("anonymousUser")) {
            // User is authenticated, get user from database
            user = userRepository.findByEmail(authentication.getName())
                    .orElse(null);
        }

        // Create order
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setSubtotal(request.subtotal() != null ? request.subtotal() : 0.0);
        order.setTaxAmount(request.taxAmount() != null ? request.taxAmount() : 0.0);
        order.setShippingCost(request.shippingCost() != null ? request.shippingCost() : 0.0);
        order.setDiscountAmount(request.discountAmount() != null ? request.discountAmount() : 0.0);
        order.setTotalAmount(request.totalAmount());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setNotes(request.notes());
        
        // Build address string
        StringBuilder addressBuilder = new StringBuilder();
        addressBuilder.append(request.address());
        if (request.apartment() != null && !request.apartment().isBlank()) {
            addressBuilder.append(", ").append(request.apartment());
        }
        if (request.city() != null && !request.city().isBlank()) {
            addressBuilder.append(", ").append(request.city());
        }
        if (request.state() != null && !request.state().isBlank()) {
            addressBuilder.append(", ").append(request.state());
        }
        order.setAddress(addressBuilder.toString());

        // Set user (can be null for guest checkout)
        order.setUser(user);

        // If guest checkout, save customer information snapshot
        if (user == null) {
            order.setCustomerFirstName(request.firstName());
            order.setCustomerLastName(request.lastName());
            order.setCustomerEmail(request.email());
            order.setCustomerPhone(request.phone());
        } else {
            // For authenticated users, also save snapshot (in case they change their profile later)
            order.setCustomerFirstName(request.firstName());
            order.setCustomerLastName(request.lastName());
            order.setCustomerEmail(request.email());
            order.setCustomerPhone(request.phone());
        }

        // Create order items and validate products
        for (CheckoutRequest.CheckoutItemRequest itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, 
                            "Product not found: " + itemRequest.productId()));

            // Validate stock
            if (product.getStock() < itemRequest.quantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Insufficient stock for product: " + product.getName() + 
                        ". Available: " + product.getStock() + ", Requested: " + itemRequest.quantity());
            }

            // Validate product is active
            if (!product.isActive()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Product is not available: " + product.getName());
            }

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPriceAtPurchase(BigDecimal.valueOf(product.getPrice()));
            orderItem.setProduct(product);
            order.addOrderItem(orderItem);

            // Reduce stock
            int updatedRows = productRepository.reduceStock(product.getId(), itemRequest.quantity());
            if (updatedRows == 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Failed to reduce stock for product: " + product.getName());
            }
        }

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Create payment
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(BigDecimal.valueOf(savedOrder.getTotalAmount()));
        
        // Map payment method from string to enum
        PaymentMethod paymentMethodEnum;
        try {
            String methodUpper = request.paymentMethod().toUpperCase().replace("-", "_");
            paymentMethodEnum = PaymentMethod.valueOf(methodUpper);
        } catch (IllegalArgumentException e) {
            // Default to BANK_TRANSFER if invalid
            paymentMethodEnum = PaymentMethod.BANK_TRANSFER;
        }
        
        payment.setPaymentMethod(paymentMethodEnum);
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        // Send order confirmation email
        try {
            OrderResponse orderResponse = OrderResponse.from(savedOrder);
            String customerEmail = orderResponse.customerEmail();
            if (customerEmail != null && !customerEmail.isBlank()) {
                emailSenderService.sendOrderConfirmationEmail(
                        customerEmail,
                        orderResponse.orderNumber(),
                        orderResponse.customerName(),
                        orderResponse.totalAmount(),
                        orderResponse.orderDate(),
                        orderResponse.itemsCount()
                );
            }
        } catch (Exception e) {
            // Log error but don't fail the checkout if email fails
            org.slf4j.LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to send order confirmation email", e);
        }

        return OrderResponse.from(savedOrder);
    }

    /**
     * Get order status by order number (public endpoint for tracking)
     * @param orderNumber Order number in format ORD-00001
     * @return OrderStatusResponse with order information
     */
    @Transactional(readOnly = true)
    public OrderStatusResponse getOrderStatusByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .map(OrderResponse::from)
                .map(OrderStatusResponse::from)
                .orElse(OrderStatusResponse.notFound(orderNumber));
    }
}

