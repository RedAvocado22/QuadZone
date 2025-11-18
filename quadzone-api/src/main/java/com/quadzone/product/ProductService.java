package com.quadzone.product;

import com.quadzone.exception.product.ProductNotFoundException;
import com.quadzone.product.category.sub_category.SubCategoryRepository;
import com.quadzone.product.dto.BrandResponse;
import com.quadzone.product.dto.ProductDetailsResponse;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductResponse;
import com.quadzone.product.dto.ProductUpdateRequest;
import com.quadzone.utils.EntityMapper;
import lombok.RequiredArgsConstructor;

import java.util.List;

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
        return productRepository.findAllBrands()
                .stream()
                .map(BrandResponse::new)
                .toList();
    }

    public Page<ProductResponse> searchProducts(String brand, Long categoryId, Long subcategoryId, Pageable pageable) {
        Page<Product> products = productRepository.searchProducts(brand, categoryId, subcategoryId, pageable);
        return products.map(objectMapper::toProductResponse);
    }

}
