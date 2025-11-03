package com.smartshelfx.service;

import com.smartshelfx.dto.ProductRequest;
import com.smartshelfx.dto.ProductResponse;
import com.smartshelfx.entity.Category;
import com.smartshelfx.entity.Product;
import com.smartshelfx.entity.Store;
import com.smartshelfx.entity.User;
import com.smartshelfx.repository.ProductRepository;
import com.smartshelfx.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final StoreRepository storeRepository; // Used for Admin creating products

    // Helper to get the store for the current user's context
    private Store getStoreForUser(User user) {
        if (user.getRole() == com.smartshelfx.entity.Role.ADMIN) {
            return null; // Admin sees all stores
        }
        return user.getStore(); // Manager sees only their store
    }

    // Helper to check if a manager owns a product
    private void checkManagerPermission(User user, Product product) {
        if (user.getRole() == com.smartshelfx.entity.Role.STORE_MANAGER) {
            if (product.getStore() == null || !product.getStore().getId().equals(user.getStore().getId())) {
                throw new SecurityException("Access Denied: You do not have permission for this product.");
            }
        }
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request, User user) {
        Store store;
        if (user.getRole() == com.smartshelfx.entity.Role.ADMIN) {
            // For this project, we'll say only Managers can create products
            throw new IllegalArgumentException("Only Store Managers can create products.");
        } else {
            // Manager creates product for their *own* store
            store = user.getStore();
            if (store == null) {
                throw new IllegalArgumentException("Store Manager has no assigned store.");
            }
        }

        Category category = categoryService.findCategoryByName(request.getCategoryName());

        Product product = Product.builder()
                .name(request.getName())
                .sku(request.getSku())
                .category(category)
                .supplier(request.getSupplier())
                .currentQuantity(request.getCurrentQuantity())
                .minStockLevel(request.getMinStockLevel())
                .maxStockLevel(request.getMaxStockLevel())
                .price(request.getPrice())
                .autoRestockEnabled(request.getAutoRestockEnabled())
                .store(store) // Set the store
                .build();

        return mapToProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request, User user) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        // Security Check:
        checkManagerPermission(user, existingProduct);

        Category category = categoryService.findCategoryByName(request.getCategoryName());

        // --- These are the getters/setters IntelliJ couldn't find ---
        existingProduct.setName(request.getName());
        existingProduct.setSku(request.getSku());
        existingProduct.setCategory(category);
        existingProduct.setSupplier(request.getSupplier());
        existingProduct.setCurrentQuantity(request.getCurrentQuantity());
        existingProduct.setMinStockLevel(request.getMinStockLevel());
        existingProduct.setMaxStockLevel(request.getMaxStockLevel());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setAutoRestockEnabled(request.getAutoRestockEnabled());
        // -----------------------------------------------------------

        return mapToProductResponse(productRepository.save(existingProduct));
    }

    public List<ProductResponse> getAllProducts(User user) {
        Store store = getStoreForUser(user);
        List<Product> products;
        if (store == null) {
            products = productRepository.findAll(); // Admin
        } else {
            products = productRepository.findAllByStore(store); // Manager
        }
        return products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id, User user) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        checkManagerPermission(user, product);

        return mapToProductResponse(product);
    }

    public void deleteProduct(Long id, User user) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        checkManagerPermission(user, existingProduct);

        productRepository.deleteById(id);
    }

    public List<ProductResponse> searchProducts(String searchTerm, User user) {
        Store store = getStoreForUser(user);
        return productRepository.searchProducts(searchTerm, store).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    // --- All Dashboard Summary Methods (Now Complete) ---

    public long getTotalProductsCount(User user) {
        Store store = getStoreForUser(user);
        if (store == null) {
            return productRepository.count(); // Admin
        }
        return productRepository.countByStore(store); // Manager
    }

    public long getLowStockItemsCount(User user) {
        Store store = getStoreForUser(user);
        List<Product> products;
        if (store == null) {
            products = productRepository.findAll();
            return products.stream()
                    .filter(p -> p.getCurrentQuantity() > 0 && p.getCurrentQuantity() <= p.getMinStockLevel())
                    .count();
        } else {
            products = productRepository.findLowStockByStore(store);
            return products.size();
        }
    }

    public long getOutOfStockItemsCount(User user) {
        Store store = getStoreForUser(user);
        List<Product> products;
        if (store == null) {
            products = productRepository.findAll();
            return products.stream()
                    .filter(p -> p.getCurrentQuantity() == 0)
                    .count();
        } else {
            products = productRepository.findOutOfStockByStore(store);
            return products.size();
        }
    }

    public double getTotalInventoryValue(User user) {
        Store store = getStoreForUser(user);
        List<Product> products;
        if (store == null) {
            products = productRepository.findAll();
        } else {
            products = productRepository.findAllByStore(store);
        }

        return products.stream()
                .mapToDouble(p -> p.getCurrentQuantity() * p.getPrice())
                .sum();
    }

    public List<ProductResponse> getLowStockProducts(User user) {
        Store store = getStoreForUser(user);
        List<Product> products;
        if (store == null) {
            products = productRepository.findAll().stream()
                    .filter(p -> p.getCurrentQuantity() > 0 && p.getCurrentQuantity() <= p.getMinStockLevel())
                    .collect(Collectors.toList());
        } else {
            products = productRepository.findLowStockByStore(store);
        }
        return products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getOutOfStockProducts(User user) {
        Store store = getStoreForUser(user);
        List<Product> products;
        if (store == null) {
            products = productRepository.findAll().stream()
                    .filter(p -> p.getCurrentQuantity() == 0)
                    .collect(Collectors.toList());
        } else {
            products = productRepository.findOutOfStockByStore(store);
        }
        return products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
    }

    // --- Private Mapper ---
    private ProductResponse mapToProductResponse(Product product) {
        // --- These are the getters IntelliJ couldn't find ---
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .categoryName(product.getCategory().getName())
                .supplier(product.getSupplier())
                .currentQuantity(product.getCurrentQuantity())
                .minStockLevel(product.getMinStockLevel())
                .maxStockLevel(product.getMaxStockLevel())
                .price(product.getPrice())
                .autoRestockEnabled(product.getAutoRestockEnabled())
                .status(product.getStatus())
                .totalValue(product.getCurrentQuantity() * product.getPrice())
                .build();
    }
}
