package com.quadzone.product;

import com.quadzone.exception.product.ProductNotFoundException;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.product.category.sub_category.SubCategoryRepository;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductResponse;
import com.quadzone.product.dto.ProductUpdateRequest;
import com.quadzone.utils.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final ProductRepository productRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final EntityMapper objectMapper;

    public Page<ProductResponse> getProducts(Pageable pageable, String query) {
        Page<Product> products;
        if (query != null && !query.isBlank()) {
            products = productRepository.search(query.trim(), pageable);
        } else {
            products = productRepository.findAll(pageable);
        }
        return products.map(objectMapper::toProductResponse);
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return objectMapper.toProductResponse(product);
    }

    public ProductResponse createProduct(ProductRegisterRequest request) {
        Product product = ProductRegisterRequest.toProduct(request);
        return objectMapper.toProductResponse(
                productRepository.save(product)
        );
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

    // Admin methods
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

        return new PagedResponse<>(
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

}
