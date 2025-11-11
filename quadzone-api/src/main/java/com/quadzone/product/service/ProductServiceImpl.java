package com.quadzone.product.service;

import com.quadzone.product.Product;
import com.quadzone.product.ProductRepository;
import com.quadzone.product.category.sub_category.SubCategory;
import com.quadzone.product.category.sub_category.SubCategoryRepository;
import com.quadzone.product.dto.ProductDTO;
import com.quadzone.product.mapper.ProductMapper;
import com.quadzone.product.exception.ProductNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Override
    public Page<ProductDTO> listProducts(Pageable pageable, String query) {
        Page<Product> products;
        if (query != null && !query.trim().isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(query, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }
        return products.map(ProductMapper::toDTO);
    }

    @Override
    public ProductDTO getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return ProductMapper.toDTO(product);
    }

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = ProductMapper.toEntity(productDTO);
        if (productDTO.getSubCategoryId() != null) {
            Optional<SubCategory> subCategoryOpt = subCategoryRepository
                    .findById(productDTO.getSubCategoryId());
            if (subCategoryOpt.isPresent()) {
                product.setSubCategory(subCategoryOpt.get());
            }
        }
        Product savedProduct = productRepository.save(product);
        return ProductMapper.toDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        product.setName(productDTO.getName());
        product.setBrand(productDTO.getBrand());
        product.setModelNumber(productDTO.getModelNumber());
        product.setPrice(productDTO.getPrice());
        product.setImageUrl(productDTO.getImageUrl());
        product.setQuantity(productDTO.getQuantity());
        product.setActive(productDTO.isActive());
        if (productDTO.getSubCategoryId() != null) {
            Optional<SubCategory> subCategoryOpt = subCategoryRepository
                    .findById(productDTO.getSubCategoryId());
            if (subCategoryOpt.isPresent()) {
                product.setSubCategory(subCategoryOpt.get());
            }
        }
        Product updatedProduct = productRepository.save(product);
        return ProductMapper.toDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
    }
}
