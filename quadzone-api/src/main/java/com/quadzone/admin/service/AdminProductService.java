package com.quadzone.admin.service;

import com.quadzone.admin.dto.AdminProductResponse;
import com.quadzone.admin.dto.PagedResponse;
import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
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
@Transactional(readOnly = true)
public class AdminProductService {

    private final ProductRepository productRepository;

    public PagedResponse<AdminProductResponse> findProducts(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Product> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = productRepository.search(search.trim(), pageable);
        } else {
            resultPage = productRepository.findAll(pageable);
        }

        var products = resultPage.stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(
                products,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    public AdminProductResponse findById(Long id) {
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + id));
    }

    private AdminProductResponse toResponse(Product product) {
        return new AdminProductResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getPrice(),
                product.getQuantity(),
                product.isActive(),
                product.getImageUrl()
        );
    }
}

