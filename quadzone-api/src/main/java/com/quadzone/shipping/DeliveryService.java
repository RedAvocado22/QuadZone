package com.quadzone.shipping;

import javax.management.RuntimeErrorException;

import org.springframework.stereotype.Service;

import com.quadzone.order.Order;
import com.quadzone.order.OrderRepository;
import com.quadzone.user.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

public Delivery findDeliveryByUserId(long userId) {
    return deliveryRepository.findByUser_Id(userId);
}

    // // public Delivery addDelivery(long staffId, long orderId) {
    // //     if(orderRepository.findById(orderId).isPresent()) {
    // //         Order order = orderRepository.findById(orderId).get();
    // //     } 

        

    // // }
}
