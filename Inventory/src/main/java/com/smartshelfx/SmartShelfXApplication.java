package com.smartshelfx;

import com.smartshelfx.entity.Category;
import com.smartshelfx.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Optional;

@SpringBootApplication
public class SmartShelfXApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartShelfXApplication.class, args);
    }

    // This code will run ONCE on startup
    @Bean
    public CommandLineRunner initData(CategoryRepository categoryRepository) {
        return args -> {
            // Check if "Default" category exists
            Optional<Category> defaultCategory = categoryRepository.findByName("Default");
            if (defaultCategory.isEmpty()) {
                // If not, create it
                Category category = Category.builder().name("Default").build();
                categoryRepository.save(category);
                System.out.println(">>> Created 'Default' category");
            }
            // Add more categories if you like
            Optional<Category> electronics = categoryRepository.findByName("Electronics");
            if (electronics.isEmpty()) {
                categoryRepository.save(Category.builder().name("Electronics").build());
                System.out.println(">>> Created 'Electronics' category");
            }
        };
    }
}