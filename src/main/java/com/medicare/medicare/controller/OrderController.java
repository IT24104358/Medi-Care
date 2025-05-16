package com.medicare.medicare.controller;

import com.medicare.medicare.model.Order;
import com.medicare.medicare.model.OrderDetails;
import com.medicare.medicare.service.OrderService;
import com.medicare.medicare.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Allow CORS for frontend
public class OrderController {

    private final OrderService orderService;
    private final OrderDetailService orderDetailService;

    @Autowired
    public OrderController(OrderService orderService, OrderDetailService orderDetailService) {
        this.orderService = orderService;
        this.orderDetailService = orderDetailService;
    }

    // Simple order summary list
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Simple order summary by ID (Long)
    @GetMapping("/{id}")
    public Optional<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    // Full order details by Order ID (String)
    @GetMapping("/details/{orderId}")
    public OrderDetails getOrderDetails(@PathVariable String orderId) {
        return orderDetailService.getOrderDetailById(orderId);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        return orderService.updateOrder(id, updatedOrder);
    }

    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        boolean deleted = orderService.deleteOrder(id);
        return deleted ? "Order deleted" : "Order not found";
    }
}
