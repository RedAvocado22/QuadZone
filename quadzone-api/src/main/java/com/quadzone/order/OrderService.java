package com.quadzone.order;

import com.quadzone.exception.order.OrderNotFoundException;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.order.dto.*;
import com.quadzone.payment.Payment;
import com.quadzone.payment.PaymentMethod;
import com.quadzone.payment.PaymentRepository;
import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.notification.NotificationService;
import com.quadzone.notification.dto.NotificationRequest;
import com.quadzone.shipping.Delivery;
import com.quadzone.shipping.DeliveryRepository;
import com.quadzone.shipping.DeliveryStatus;
import com.quadzone.user.User;
import com.quadzone.user.UserRole;
import com.quadzone.user.UserRepository;
import com.quadzone.utils.email.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
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
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final EmailSenderService emailSenderService;
    private final NotificationService notificationService;
    private final DeliveryRepository deliveryRepository;

    public OrderResponse getOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        return OrderResponse.from(order);
    }

    public OrderResponse createOrder(OrderRegisterRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.userId()));

        Order order = OrderRegisterRequest.toOrder(request, user);
        Order savedOrder = orderRepository.save(order);
        OrderResponse orderResponse = OrderResponse.from(savedOrder);
        
        // Notify Admin and Staff about new order
        notifyNewOrderToAdminAndStaff(orderResponse);
        
        // Notify admin about staff activity if order was created by staff
        if (user.getRole() == UserRole.STAFF) {
            notifyStaffActivityToAdmin(user, "Order Created", 
                    String.format("Staff %s created order #%s", user.getFullName(), orderResponse.orderNumber()));
        }
        
        return orderResponse;
    }

    public OrderResponse updateOrder(Long id, OrderUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        // Store old status to check if it changed
        OrderStatus oldStatus = order.getOrderStatus();
        
        order.updateFrom(request);
        
        Order savedOrder = orderRepository.save(order);
        OrderResponse orderResponse = OrderResponse.from(savedOrder);
        
        // Notify user if order status changed
        if (request.orderStatus() != null && !request.orderStatus().equals(oldStatus)) {
            notifyOrderStatusChangeToUser(savedOrder, oldStatus, request.orderStatus());
            
            // Notify shipper if order status is PROCESSING or CONFIRMED (ready for delivery)
            if (request.orderStatus() == OrderStatus.PROCESSING || request.orderStatus() == OrderStatus.CONFIRMED) {
                notifyOrderToShippers(savedOrder);
            }
        }
        
        // Notify admin about staff activity if order was updated by staff
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                User currentUser = userRepository.findByEmail(authentication.getName()).orElse(null);
                if (currentUser != null && currentUser.getRole() == UserRole.STAFF) {
                    notifyStaffActivityToAdmin(currentUser, "Order Updated", 
                            String.format("Staff %s updated order #%s", currentUser.getFullName(), orderResponse.orderNumber()));
                }
            }
        } catch (Exception e) {
            LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to notify admin about staff activity", e);
        }

        return orderResponse;
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
     *
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
        payment.setAmount(savedOrder.getTotalAmount());

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
        paymentRepository.save(payment);

        // Send order confirmation email
        OrderResponse orderResponse = OrderResponse.from(savedOrder);
        try {
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
            LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to send order confirmation email", e);
        }

        // Create notifications for Admin and Staff users
        notifyNewOrderToAdminAndStaff(orderResponse);

        return orderResponse;
    }

    /**
     * Get order status by order number (public endpoint for tracking)
     *
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

    /**
     * Assign order to shipper (for Staff)
     * 
     * @param orderId Order ID to assign
     * @param request Request containing shipper ID and delivery details
     * @return OrderResponse with updated order information
     */
    public OrderResponse assignOrderToShipper(Long orderId, AssignOrderToShipperRequest request) {
        // Find order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // Validate and find shipper
        User shipper = userRepository.findById(request.shipperId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, 
                        "Shipper not found: " + request.shipperId()));

        // Verify user is a shipper
        if (shipper.getRole() != UserRole.SHIPPER) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User with ID " + request.shipperId() + " is not a shipper. Role: " + shipper.getRole());
        }

        // Get or create delivery
        Delivery delivery = deliveryRepository.findByOrder(order)
                .orElse(new Delivery());

        delivery.setOrder(order);
        delivery.setUser(shipper); // Assign to shipper
        delivery.setDeliveryStatus(DeliveryStatus.PENDING);

        // Set optional fields
        if (request.trackingNumber() != null && !request.trackingNumber().isBlank()) {
            delivery.setTrackingNumber(request.trackingNumber());
        } else {
            // Generate tracking number if not provided
            delivery.setTrackingNumber("TRACK-" + String.format("%08d", order.getId()));
        }

        if (request.deliveryNotes() != null && !request.deliveryNotes().isBlank()) {
            delivery.setDeliveryNotes(request.deliveryNotes());
        }

        // Save delivery
        deliveryRepository.save(delivery);

        // Update order status to PROCESSING if still PENDING or CONFIRMED
        if (order.getOrderStatus() == OrderStatus.PENDING || order.getOrderStatus() == OrderStatus.CONFIRMED) {
            order.setOrderStatus(OrderStatus.PROCESSING);
            orderRepository.save(order);
        }

        OrderResponse orderResponse = OrderResponse.from(order);

        // Notify assigned shipper
        try {
            String orderNumber = "ORD-" + String.format("%05d", order.getId());
            String customerName = orderResponse.customerName() != null 
                    ? orderResponse.customerName() 
                    : "Customer";

            NotificationRequest notificationRequest = new NotificationRequest(
                    "delivery_assigned",
                    "Order Assigned to You",
                    String.format("Order #%s from %s has been assigned to you for delivery. Address: %s", 
                            orderNumber,
                            customerName,
                            order.getAddress() != null && order.getAddress().length() > 50 
                                    ? order.getAddress().substring(0, 50) + "..." 
                                    : order.getAddress()),
                    null // avatarUrl
            );

            notificationService.createNotification(shipper.getId(), notificationRequest);
        } catch (Exception e) {
            LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to notify shipper about order assignment", e);
        }

        // Notify admin about staff activity
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                User currentUser = userRepository.findByEmail(authentication.getName()).orElse(null);
                if (currentUser != null && currentUser.getRole() == UserRole.STAFF) {
                    notifyStaffActivityToAdmin(currentUser, "Order Assigned to Shipper",
                            String.format("Staff %s assigned order #%s to shipper %s",
                                    currentUser.getFullName(),
                                    "ORD-" + String.format("%05d", order.getId()),
                                    shipper.getFullName()));
                }
            }
        } catch (Exception e) {
            LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to notify admin about staff activity", e);
        }

        return orderResponse;
    }

    /**
     * Notify Admin and Staff about new order
     */
    private void notifyNewOrderToAdminAndStaff(OrderResponse orderResponse) {
        try {
            String customerName = orderResponse.customerName() != null 
                    ? orderResponse.customerName() 
                    : "Guest Customer";
            
            Double totalAmount = orderResponse.totalAmount();
            String totalAmountStr = totalAmount != null 
                    ? String.format("$%.2f", totalAmount)
                    : "N/A";
            
            NotificationRequest notificationRequest = new NotificationRequest(
                    "order",
                    "New Order Received",
                    String.format("New order #%s from %s. Total: %s (%d item%s)", 
                            orderResponse.orderNumber(), 
                            customerName,
                            totalAmountStr,
                            orderResponse.itemsCount(),
                            orderResponse.itemsCount() != 1 ? "s" : ""),
                    null // avatarUrl
            );

            // Notify Admin users
            List<User> adminUsers = userRepository.findByRole(UserRole.ADMIN);
            for (User admin : adminUsers) {
                notificationService.createNotification(admin.getId(), notificationRequest);
            }

            // Notify Staff users
            List<User> staffUsers = userRepository.findByRole(UserRole.STAFF);
            for (User staff : staffUsers) {
                notificationService.createNotification(staff.getId(), notificationRequest);
            }
        } catch (Exception e) {
            LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to create notifications for admin and staff", e);
        }
    }

    /**
     * Notify User (Customer) about order status change
     */
    private void notifyOrderStatusChangeToUser(Order order, OrderStatus oldStatus, OrderStatus newStatus) {
        try {
            // Get customer user from order
            User customerUser = order.getUser();
            if (customerUser == null) {
                // For guest orders, we can't notify via in-app notification
                // Email notification should be sent separately
                return;
            }

            String statusDisplayName = formatOrderStatus(newStatus);
            String oldStatusDisplayName = formatOrderStatus(oldStatus);
            
            NotificationRequest notificationRequest = new NotificationRequest(
                    "order_status",
                    "Order Status Updated",
                    String.format("Your order #%s status has been updated from %s to %s", 
                            "ORD-" + String.format("%05d", order.getId()),
                            oldStatusDisplayName,
                            statusDisplayName),
                    null // avatarUrl
            );

            notificationService.createNotification(customerUser.getId(), notificationRequest);
        } catch (Exception e) {
            LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to notify user about order status change", e);
        }
    }

    /**
     * Notify Shipper users about order ready for delivery
     */
    private void notifyOrderToShippers(Order order) {
        try {
            String orderNumber = "ORD-" + String.format("%05d", order.getId());
            String customerName = order.getCustomerFirstName() != null && order.getCustomerLastName() != null
                    ? order.getCustomerFirstName() + " " + order.getCustomerLastName()
                    : "Customer";
            
            NotificationRequest notificationRequest = new NotificationRequest(
                    "delivery",
                    "New Delivery Assignment",
                    String.format("Order #%s from %s is ready for delivery. Address: %s", 
                            orderNumber,
                            customerName,
                            order.getAddress() != null && order.getAddress().length() > 50 
                                    ? order.getAddress().substring(0, 50) + "..." 
                                    : order.getAddress()),
                    null // avatarUrl
            );

            List<User> shipperUsers = userRepository.findByRole(UserRole.SHIPPER);
            for (User shipper : shipperUsers) {
                notificationService.createNotification(shipper.getId(), notificationRequest);
            }
        } catch (Exception e) {
            LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to notify shippers about new delivery", e);
        }
    }

    /**
     * Notify Admin about Staff activities
     */
    private void notifyStaffActivityToAdmin(User staffUser, String activityType, String description) {
        try {
            NotificationRequest notificationRequest = new NotificationRequest(
                    "staff_activity",
                    activityType,
                    description,
                    null // avatarUrl
            );

            List<User> adminUsers = userRepository.findByRole(UserRole.ADMIN);
            for (User admin : adminUsers) {
                notificationService.createNotification(admin.getId(), notificationRequest);
            }
        } catch (Exception e) {
            LoggerFactory.getLogger(OrderService.class)
                    .error("Failed to notify admin about staff activity", e);
        }
    }

    /**
     * Format order status for display
     */
    private String formatOrderStatus(OrderStatus status) {
        if (status == null) return "Unknown";
        return status.name().charAt(0) + status.name().substring(1).toLowerCase().replace("_", " ");
    }
}

