// DataInitializationService.java
package com.medicare.medicare.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicare.medicare.model.Product;
//import com.medicare.medicare.model.User;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataInitializationService {
    private static final String USERS_FILE_PATH = "src/main/resources/data/users.json";
    private static final String PRODUCTS_FILE_PATH = "src/main/resources/data/products.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @com.medicare.medicare.config.PostConstruct
//    public void initData() {
//        initUsers();
//        initProducts();
//    }

//    private void initUsers() {
//        File file = new File(USERS_FILE_PATH);
//        if (!file.exists()) {
//            try {
//                file.getParentFile().mkdirs();
//
//                // Create default admin user
//                List<User> defaultUsers = new ArrayList<>();
//                User admin = new User();
//                admin.setId(1L);
//                admin.setUsername("admin");
//                admin.setPassword("admin123");
//                admin.setAdmin(true);
//                defaultUsers.add(admin);
//
//                objectMapper.writeValue(file, defaultUsers);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
//    }

    private void initProducts() {
        File file = new File(PRODUCTS_FILE_PATH);
        if (!file.exists()) {
            try {
                file.getParentFile().mkdirs();

                // Create some example products
                List<Product> sampleProducts = new ArrayList<>();

                Product product1 = new Product();
                product1.setId(1L);
                product1.setName("Paracetamol");
                product1.setDescription("Pain reliever and fever reducer");
                product1.setPrice(5.99);
                product1.setStock(100);
                sampleProducts.add(product1);

                Product product2 = new Product();
                product2.setId(2L);
                product2.setName("Bandages");
                product2.setDescription("Adhesive bandages, pack of 20");
                product2.setPrice(3.50);
                product2.setStock(50);
                sampleProducts.add(product2);

                objectMapper.writeValue(file, sampleProducts);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}