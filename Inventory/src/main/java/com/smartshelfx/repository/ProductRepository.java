package com.smartshelfx.repository;

import com.smartshelfx.entity.Product;
import com.smartshelfx.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);

    // --- Store-Specific Methods ---
    List<Product> findAllByStore(Store store);
    long countByStore(Store store);

    // Find low stock items for a specific store
    @Query("SELECT p FROM Product p WHERE p.store = :store AND p.currentQuantity > 0 AND p.currentQuantity <= p.minStockLevel")
    List<Product> findLowStockByStore(@Param("store") Store store);

    // Find out of stock items for a specific store
    @Query("SELECT p FROM Product p WHERE p.store = :store AND p.currentQuantity = 0")
    List<Product> findOutOfStockByStore(@Param("store") Store store);

    // --- Combined Search Method ---
    // This will be used by the service to handle both Admin and Manager searches
    @Query("SELECT p FROM Product p WHERE " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND (:store IS NULL OR p.store = :store)") // Filter by store if store is provided
    List<Product> searchProducts(@Param("searchTerm") String searchTerm, @Param("store") Store store);
}