package com.medicare.medicare.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicare.medicare.model.Order;
import com.medicare.medicare.model.OrderDetails;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderFileRepository {

    private static final String FILE_PATH = "src/main/resources/data/orders.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Load orders from the file system
    public List<Order> findAll() {
        try {
            File file = new File(FILE_PATH);
            if (!file.exists()) return new ArrayList<>();
            return objectMapper.readValue(file, new TypeReference<List<Order>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Load orders from the resource file
    public List<OrderDetails> loadOrders() {
        try (InputStream is = getClass().getResourceAsStream("/data/orders.json")) {
            if (is == null) {
                throw new IOException("Resource not found");
            }
            return objectMapper.readValue(is, new TypeReference<List<OrderDetails>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Unable to load orders from resource", e);
        }
    }

    // Find an order by its ID
    public Optional<Order> findById(Long id) {
        return findAll().stream()
                .filter(order -> order.getId().equals(id))
                .findFirst();
    }

    // Save a new or update an existing order
    public Order save(Order order) {
        List<Order> orders = findAll();

        // Assign ID if new
        if (order.getId() == null) {
            long maxId = orders.stream()
                    .mapToLong(Order::getId)
                    .max()
                    .orElse(0);
            order.setId(maxId + 1);
            orders.add(order);
        } else {
            // Update existing order
            for (int i = 0; i < orders.size(); i++) {
                if (orders.get(i).getId().equals(order.getId())) {
                    orders.set(i, order);
                    break;
                }
            }
        }

        saveAll(orders);
        return order;
    }

    // Delete an order by its ID
    public void delete(Long id) {
        List<Order> orders = findAll();
        orders.removeIf(order -> order.getId().equals(id));
        saveAll(orders);
    }

    // Save all orders to the file system
    private void saveAll(List<Order> orders) {
        try {
            File file = new File(FILE_PATH);
            file.getParentFile().mkdirs();
            objectMapper.writeValue(file, orders);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
