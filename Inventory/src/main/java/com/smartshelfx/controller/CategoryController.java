package com.smartshelfx.controller;

import com.smartshelfx.dto.CategoryResponse;
import com.smartshelfx.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // --- THIS IS THE FIX ---
    // Allow both Admin and Store Manager to get categories
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STORE_MANAGER')")
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // --- THIS IS THE FIX ---
    // Allow both Admin and Store Manager to create categories
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STORE_MANAGER')")
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody String categoryName) {
        try {
            // Note: This endpoint is simple. A better one would take a JSON object.
            // For now, it expects a plain text string.
            return ResponseEntity.ok(categoryService.createCategory(categoryName));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
