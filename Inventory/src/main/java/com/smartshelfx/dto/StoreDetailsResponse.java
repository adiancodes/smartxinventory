package com.smartshelfx.dto;

import com.smartshelfx.entity.Store;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StoreDetailsResponse {
    // Store Info
    private Long id;
    private String storeName;
    private String location;

    // Stats
    private long totalProducts;
    private double totalValue;
    private long lowStockCount;
    private long outOfStockCount;

    // Full product list for that store
    private List<ProductResponse> products;
}