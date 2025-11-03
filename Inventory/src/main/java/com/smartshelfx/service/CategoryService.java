package com.smartshelfx.service;

import com.smartshelfx.dto.CategoryResponse;
import com.smartshelfx.entity.Category;
import com.smartshelfx.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse createCategory(String categoryName) {
        if (categoryRepository.findByName(categoryName).isPresent()) {
            throw new IllegalArgumentException("Category with name '" + categoryName + "' already exists.");
        }
        Category category = Category.builder().name(categoryName).build();
        Category savedCategory = categoryRepository.save(category);
        return mapToCategoryResponse(savedCategory);
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }

    public Category findCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + name));
    }
}