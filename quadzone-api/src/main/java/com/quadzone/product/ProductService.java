package com.quadzone.product;

import com.quadzone.admin.dto.ProductAdminResponse;
import com.quadzone.exception.product.ProductNotFoundException;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.product.category.sub_category.SubCategoryRepository;
import com.quadzone.product.dto.BrandResponse;
import com.quadzone.product.dto.ProductDetailsResponse;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductResponse;
import com.quadzone.product.dto.ProductUpdateRequest;
import com.quadzone.utils.EntityMapper;

import jakarta.persistence.criteria.Join;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final EntityMapper objectMapper;

    public Page<ProductResponse> getProducts(Pageable pageable, String query) {
        Page<Product> products;
        products = productRepository.search(query, pageable);
        return products.map(objectMapper::toProductResponse);
    }

    public ProductDetailsResponse getProducts(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return objectMapper.toProductDetailsResponse(product);
    }

    public Page<ProductResponse> getFeaturedProducts(Pageable pageable) {
        Page<Product> products;
        products = productRepository.findFeaturedProducts(pageable);
        return products.map(objectMapper::toProductResponse);
    }

    public Page<ProductResponse> getBestSellers(Pageable pageable) {
        Page<Product> products;
        products = productRepository.findBestSellingProducts(pageable);
        return products.map(objectMapper::toProductResponse);
    }

    public Page<ProductResponse> getArrivals(Pageable pageable) {
        Page<Product> products;
        products = productRepository.findNewArrivalProducts(pageable);
        return products.map(objectMapper::toProductResponse);
    }

    public ProductResponse createProduct(ProductRegisterRequest request) {
        Product product = ProductRegisterRequest.toProduct(request);
        return objectMapper.toProductResponse(
                productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        product.updateFrom(request);

        return objectMapper.toProductResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
    }

    public List<BrandResponse> listBrands() {
        return productRepository.findAllDistinctBrands()
                .stream()
                .map(BrandResponse::new)
                .toList();
    }

    /**
     * Search products with filters
     * Product → SubCategory → Category relationship
     */
    public Page<ProductResponse> searchProducts(
            String brand,
            Long categoryId,
            Long subcategoryId,
            Double minPrice,
            Double maxPrice,
            Pageable pageable) {
        
        try {
            log.debug("Searching products - brand: {}, categoryId: {}, subcategoryId: {}, minPrice: {}, maxPrice: {}", 
                brand, categoryId, subcategoryId, minPrice, maxPrice);
            
            Specification<Product> spec = buildProductSpecification(
                brand, categoryId, subcategoryId, minPrice, maxPrice
            );
            
            Page<Product> products = productRepository.findAll(spec, pageable);
            
            return products.map(ProductResponse::from);
            
        } catch (Exception e) {
            log.error("Error searching products", e);
            throw new RuntimeException("Failed to search products: " + e.getMessage(), e);
        }
    }
    
    /**
     * Build JPA Specification for filtering
     * Your Product entity structure: Product → SubCategory → Category
     */
    private Specification<Product> buildProductSpecification(
            String brand,
            Long categoryId,
            Long subcategoryId,
            Double minPrice,
            Double maxPrice) {
        
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Filter by brand(s) (case-insensitive)
            // Supports comma-separated brands: "Brand1,Brand2,Brand3"
            if (brand != null && !brand.trim().isEmpty()) {
                String[] brands = brand.split(",");
                if (brands.length == 1) {
                    // Single brand
                    predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("brand")), 
                        brands[0].toLowerCase().trim()
                    ));
                } else {
                    // Multiple brands - use OR clause
                    List<Predicate> brandPredicates = new ArrayList<>();
                    for (String b : brands) {
                        brandPredicates.add(criteriaBuilder.equal(
                            criteriaBuilder.lower(root.get("brand")), 
                            b.toLowerCase().trim()
                        ));
                    }
                    predicates.add(criteriaBuilder.or(brandPredicates.toArray(new Predicate[0])));
                }
            }
            
            // IMPORTANT: Product only has SubCategory, not Category directly
            // So we need to join through SubCategory to get to Category
            
            if (subcategoryId != null) {
                // Filter by subcategory - direct relationship
                predicates.add(criteriaBuilder.equal(
                    root.get("subCategory").get("id"), 
                    subcategoryId
                ));
            } else if (categoryId != null) {
                // Filter by category - need to join through subCategory
                // Product → SubCategory → Category
                Join<Object, Object> subCategoryJoin = root.join("subCategory", JoinType.INNER);
                Join<Object, Object> categoryJoin = subCategoryJoin.join("category", JoinType.INNER);
                
                predicates.add(criteriaBuilder.equal(
                    categoryJoin.get("id"), 
                    categoryId
                ));
            }
            
            // Filter by minimum price
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("price"), 
                    minPrice
                ));
            }
            
            // Filter by maximum price
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("price"), 
                    maxPrice
                ));
            }
            
            // Only show active products
            predicates.add(criteriaBuilder.equal(root.get("isActive"), true));
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> findProducts(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Product> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = productRepository.search(search.trim(), pageable);
        } else {
            resultPage = productRepository.findAll(pageable);
        }

        var products = resultPage.stream()
                .map(objectMapper::toProductResponse)
                .toList();

        return PagedResponse.of(
                products,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public ProductResponse findByIdForAdmin(Long id) {
        return productRepository.findById(id)
                .map(objectMapper::toProductResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + id));
    }

    // Admin methods with admin DTOs
    @Transactional(readOnly = true)
    public PagedResponse<ProductAdminResponse> findProductsForAdmin(int page, int size, String search, String sortBy) {
        // Parse sortBy parameter (e.g., "price:asc", "createdAt:desc")
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt"); // default sort
        if (sortBy != null && !sortBy.isBlank()) {
            String[] parts = sortBy.split(":");
            String field = parts[0];
            Sort.Direction direction = parts.length > 1 && "asc".equalsIgnoreCase(parts[1]) 
                    ? Sort.Direction.ASC 
                    : Sort.Direction.DESC;
            sort = Sort.by(direction, field);
        }
        
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), sort);

        Page<Product> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = productRepository.search(search.trim(), pageable);
        } else {
            resultPage = productRepository.findAll(pageable);
        }

        var products = resultPage.stream()
                .map(ProductAdminResponse::from)
                .toList();

        return PagedResponse.of(
                products,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public ProductAdminResponse findByIdForAdminWithDetails(Long id) {
        return productRepository.findById(id)
                .map(ProductAdminResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + id));
    }

    public ProductAdminResponse createProductForAdmin(ProductRegisterRequest request) {
        Product product = ProductRegisterRequest.toProduct(request);
        return ProductAdminResponse.from(productRepository.save(product));
    }

    public ProductAdminResponse updateProductForAdmin(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        product.updateFrom(request);

        return ProductAdminResponse.from(productRepository.save(product));
    }
}
