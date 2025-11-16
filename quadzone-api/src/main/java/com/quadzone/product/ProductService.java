package com.quadzone.product;

import com.quadzone.exception.product.ProductNotFoundException;
import com.quadzone.product.category.sub_category.SubCategoryRepository;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductResponse;
import com.quadzone.product.dto.ProductUpdateRequest;
import com.quadzone.utils.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final ProductRepository productRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final EntityMapper objectMapper;

    public Page<ProductResponse> getProducts(Pageable pageable, String query) {
        Page<Product> products;
        products = productRepository.findByNameContainingIgnoreCase(query, pageable);
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
}
