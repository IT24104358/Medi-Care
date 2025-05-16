package com.medicare.medicare.service;

import com.medicare.medicare.model.Order;
import com.medicare.medicare.repository.OrderFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderFileRepository orderRepository;

    @Autowired
    public OrderService(OrderFileRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        Optional<Order> existingOrder = orderRepository.findById(id);
        if (existingOrder.isPresent()) {
            Order order = existingOrder.get();
            order.setCustomerName(updatedOrder.getCustomerName());
            order.setProductName(updatedOrder.getProductName());
            order.setQuantity(updatedOrder.getQuantity());
            order.setTotalPrice(updatedOrder.getTotalPrice());
            order.setStatus(updatedOrder.getStatus());
            return orderRepository.save(order);
        }
        return null;
    }

    public boolean deleteOrder(Long id) {
        Optional<Order> existingOrder = orderRepository.findById(id);
        if (existingOrder.isPresent()) {
            orderRepository.delete(id);
            return true;
        }
        return false;
    }
}
