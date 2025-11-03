package com.smartshelfx.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Positive;

@Data
public class ProductRequest {
    private Long id; // For update operations

    @NotBlank(message = "Product name cannot be empty")
    private String name;

    @NotBlank(message = "SKU cannot be empty")
    private String sku;

    @NotBlank(message = "Category name cannot be empty")
    private String categoryName; // Frontend sends category name, backend resolves to ID

    private String supplier;

    @NotNull(message = "Current quantity cannot be null")
    @PositiveOrZero(message = "Current quantity must be positive or zero")
    private Integer currentQuantity;

    @NotNull(message = "Min stock level cannot be null")
    @PositiveOrZero(message = "Min stock level must be positive or zero")
    private Integer minStockLevel;

    @NotNull(message = "Max stock level cannot be null")
    @Positive(message = "Max stock level must be positive")
    private Integer maxStockLevel;

    @NotNull(message = "Price cannot be null")
    @PositiveOrZero(message = "Price must be positive or zero")
    private Double price;

    private Boolean autoRestockEnabled = false;
}