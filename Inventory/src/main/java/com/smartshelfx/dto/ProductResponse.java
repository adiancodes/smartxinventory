package com.smartshelfx.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private String categoryName; // Category name for display
    private String supplier;
    private Integer currentQuantity;
    private Integer minStockLevel;
    private Integer maxStockLevel;
    private Double price;
    private Boolean autoRestockEnabled;
    private String status; // Derived property: "In Stock", "Low Stock", "Out of Stock"
    private Double totalValue; // Calculated: currentQuantity * price
}