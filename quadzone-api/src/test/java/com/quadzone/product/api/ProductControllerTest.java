package com.quadzone.product.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quadzone.product.dto.ProductDTO;
import com.quadzone.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testListProducts() throws Exception {
        ProductDTO product = ProductDTO.builder()
                .id(1L)
                .name("Test Product")
                .price(99.99)
                .quantity(10)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        Page<ProductDTO> page = new PageImpl<>(List.of(product), PageRequest.of(0, 10), 1);

        when(productService.listProducts(any(Pageable.class), eq(null))).thenReturn(page);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Test Product"));
    }

    @Test
    void testGetProduct() throws Exception {
        ProductDTO product = ProductDTO.builder()
                .id(1L)
                .name("Test Product")
                .price(99.99)
                .quantity(10)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        when(productService.getProduct(1L)).thenReturn(product);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    void testGetProductNotFound() throws Exception {
        when(productService.getProduct(999L)).thenThrow(new RuntimeException("Product not found"));

        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound());
    }
}
