package com.quadzone.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quadzone.admin.dto.CategoryAdminResponse;
import com.quadzone.admin.dto.ProductAdminResponse;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.product.ProductService;
import com.quadzone.product.category.CategoryService;
import com.quadzone.product.category.dto.CategoryRegisterRequest;
import com.quadzone.product.category.dto.CategoryUpdateRequest;
import com.quadzone.product.category.sub_category.SubCategoryService;
import com.quadzone.product.dto.ProductRegisterRequest;
import com.quadzone.product.dto.ProductUpdateRequest;
import com.quadzone.upload.service.UploadService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AdminControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @Mock
    private CategoryService categoryService;

    @Mock
    private SubCategoryService subCategoryService;

    @Mock
    private UploadService uploadService;

    @InjectMocks
    private AdminController adminController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
    }

    // ----------------------- PRODUCT -----------------------

    @Test
    public void testGetProduct() throws Exception {
        ProductAdminResponse productAdminResponse =
                new ProductAdminResponse(
                        1L,
                        "name",
                        "brand",
                        "modelNumber",
                        "color",
                        "description",
                        1.0,
                        1.0,
                        1.0,
                        1,
                        "imageUrl",
                        true,
                        null,
                        null,
                        null,
                        null
                );

        when(productService.findByIdForAdminWithDetails(1L)).thenReturn(productAdminResponse);

        mockMvc.perform(get("/api/v1/admin/products/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testCreateProduct() throws Exception {
        ProductRegisterRequest req =
                new ProductRegisterRequest(
                        "name",
                        "brand",
                        "modelNumber",
                        "description",
                        1,
                        1.0,
                        1.0,
                        1.0,
                        "color",
                        "imageUrl",
                        null,
                        null,
                        true
                );

        ProductAdminResponse res =
                new ProductAdminResponse(
                        1L,
                        "name",
                        "brand",
                        "modelNumber",
                        "color",
                        "description",
                        1.0,
                        1.0,
                        1.0,
                        1,
                        "imageUrl",
                        true,
                        null,
                        null,
                        null,
                        null
                );

        when(productService.createProductForAdmin(any(ProductRegisterRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/v1/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdateProduct() throws Exception {
        ProductUpdateRequest req =
                new ProductUpdateRequest(
                        "name",
                        "brand",
                        "modelNumber",
                        "description",
                        1,
                        1.0,
                        1.0,
                        1.0,
                        "color",
                        "imageUrl",
                        null,
                        null
                );

        ProductAdminResponse res =
                new ProductAdminResponse(
                        1L,
                        "name",
                        "brand",
                        "modelNumber",
                        "color",
                        "description",
                        1.0,
                        1.0,
                        1.0,
                        1,
                        "imageUrl",
                        true,
                        null,
                        null,
                        null,
                        null
                );

        when(productService.updateProductForAdmin(any(Long.class), any(ProductUpdateRequest.class)))
                .thenReturn(res);

        mockMvc.perform(put("/api/v1/admin/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    public void testDeleteProduct() throws Exception {
        mockMvc.perform(delete("/api/v1/admin/products/1"))
                .andExpect(status().isNoContent());
    }

    // ----------------------- CATEGORY -----------------------

    @Test
    public void testGetCategory() throws Exception {
        CategoryAdminResponse categoryAdminResponse =
                new CategoryAdminResponse(1L, "name", true, "imageUrl", 0, 0, List.of());

        when(categoryService.findByIdForAdmin(1L)).thenReturn(categoryAdminResponse);

        mockMvc.perform(get("/api/v1/admin/categories/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testCreateCategory() throws Exception {
        CategoryRegisterRequest req = new CategoryRegisterRequest("name", true, "imageUrl");
        CategoryAdminResponse res =
                new CategoryAdminResponse(1L, "name", true, "imageUrl", 0, 0, List.of());

        when(categoryService.createCategoryForAdmin(any(CategoryRegisterRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/v1/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdateCategory() throws Exception {
        CategoryUpdateRequest categoryUpdateRequest =
                new CategoryUpdateRequest("name", true, "https://example.com/img.png");

        CategoryAdminResponse categoryAdminResponse =
                new CategoryAdminResponse(1L, "name", true, "https://example.com/img.png", 0, 0, null);

        when(categoryService.updateCategoryForAdmin(any(Long.class), any(CategoryUpdateRequest.class)))
                .thenReturn(categoryAdminResponse);

        mockMvc.perform(put("/api/v1/admin/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryUpdateRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void testDeleteCategory() throws Exception {
        mockMvc.perform(delete("/api/v1/admin/categories/1"))
                .andExpect(status().isNoContent());
    }
}
