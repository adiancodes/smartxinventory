package com.smartshelfx.controller;

import com.smartshelfx.dto.ProductRequest;
import com.smartshelfx.dto.ProductResponse;
import com.smartshelfx.entity.User;
import com.smartshelfx.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
// --- THIS SETS THE PERMISSION FOR THE WHOLE FILE ---
@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STORE_MANAGER')")
public class ProductController {

    private final ProductService productService;

    // POST /api/products
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request,
                                                         @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(productService.createProduct(request, user));
        } catch (IllegalArgumentException e) {
            // This will catch "Store Manager has no assigned store."
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT /api/products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                         @Valid @RequestBody ProductRequest request,
                                                         @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, request, user));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build(); // Forbidden
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).build(); // Not Found
        }
    }

    // DELETE /api/products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
                                              @AuthenticationPrincipal User user) {
        try {
            productService.deleteProduct(id, user);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).build();
        }
    }

    // GET /api/products
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(@RequestParam(required = false) String searchTerm,
                                                                @AuthenticationPrincipal User user) {
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            return ResponseEntity.ok(productService.searchProducts(searchTerm, user));
        }
        return ResponseEntity.ok(productService.getAllProducts(user));
    }

    // GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id,
                                                          @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(productService.getProductById(id, user));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).build();
        }
    }

    // --- Dashboard Summary Endpoints ---

    @GetMapping("/summary/total-count")
    public ResponseEntity<Long> getTotalProductsCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getTotalProductsCount(user));
    }

    @GetMapping("/summary/low-stock-count")
    public ResponseEntity<Long> getLowStockItemsCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getLowStockItemsCount(user));
    }

    @GetMapping("/summary/out-of-stock-count")
    public ResponseEntity<Long> getOutOfStockItemsCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getOutOfStockItemsCount(user));
    }

    @GetMapping("/summary/total-value")
    public ResponseEntity<Double> getTotalInventoryValue(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getTotalInventoryValue(user));
    }

    @GetMapping("/summary/low-stock-products")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getLowStockProducts(user));
    }

    @GetMapping("/summary/out-of-stock-products")
    public ResponseEntity<List<ProductResponse>> getOutOfStockProducts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getOutOfStockProducts(user));
    }
}
