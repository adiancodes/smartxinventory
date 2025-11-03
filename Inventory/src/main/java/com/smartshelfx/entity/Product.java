package com.smartshelfx.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String sku; // Stock Keeping Unit (e.g., GP-002-BK)

    @ManyToOne(fetch = FetchType.EAGER) // Eagerly fetch category with product
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private String supplier;

    @Column(nullable = false)
    private Integer currentQuantity;

    @Column(nullable = false)
    private Integer minStockLevel;

    @Column(nullable = false)
    private Integer maxStockLevel;

    @Column(nullable = false)
    private Double price; // Price per unit

    @Column(nullable = false)
    @Builder.Default // Fixes the builder warning
    private Boolean autoRestockEnabled = false; // Default to false

    // --- THIS IS THE NEW FIELD THAT IS MISSING ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Transient
    public String getStatus() {
        if (currentQuantity == 0) {
            return "Out of Stock";
        } else if (currentQuantity <= minStockLevel) {
            return "Low Stock";
        } else {
            return "In Stock";
        }
    }
}