package com.medicalstore.model;

import java.time.LocalDate;
import java.util.List;

public class Order {
    private String orderNumber;
    private LocalDate orderDate;
    private String paymentMethod;
    private BillingAddress billingAddress;
    private List<Item> items;
    private double shippingCost;
    private List<Review> reviews;

    // Constructor
    public Order() {}

    public Order(String orderNumber, LocalDate orderDate, String paymentMethod,
                 BillingAddress billingAddress, List<Item> items, double shippingCost, List<Review> reviews) {
        this.orderNumber = orderNumber;
        this.orderDate = orderDate;
        this.paymentMethod = paymentMethod;
        this.billingAddress = billingAddress;
        this.items = items;
        this.shippingCost = shippingCost;
        this.reviews = reviews;
    }

    // Getters and Setters
    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BillingAddress getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(BillingAddress billingAddress) {
        this.billingAddress = billingAddress;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public double getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(double shippingCost) {
        this.shippingCost = shippingCost;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public double getSubtotal() {
        return items.stream().mapToDouble(Item::getTotalPrice).sum();
    }

    public double getTotal() {
        return getSubtotal() + shippingCost;
    }
}
