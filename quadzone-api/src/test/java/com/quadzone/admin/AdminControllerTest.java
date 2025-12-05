package com.quadzone.admin;

import com.quadzone.blog.BlogService;
import com.quadzone.blog.comment.CommentRepository;
import com.quadzone.payment.PaymentRepository;
import com.quadzone.product.ProductService;
import com.quadzone.product.category.CategoryService;
import com.quadzone.product.category.sub_category.SubCategoryService;
import com.quadzone.shipping.DeliveryRepository;
import com.quadzone.upload.service.UploadService;
import com.quadzone.order.OrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private ProductService productService;
    @MockBean private CategoryService categoryService;
    @MockBean private SubCategoryService subCategoryService;
    @MockBean private UploadService uploadService;
    @MockBean private AdminAnalyticsService adminAnalyticsService;
    @MockBean private BlogService blogService;
    @MockBean private CommentRepository commentRepository;
    @MockBean private OrderRepository orderRepository;
    @MockBean private PaymentRepository paymentRepository;
    @MockBean private DeliveryRepository deliveryRepository;

    @Test
    void getAdminNews_returnsOk_whenDependenciesInjected() throws Exception {
        int size = 3;
        Pageable commentsPage = PageRequest.of(0, size);
        Pageable ordersPage = PageRequest.of(0, size);
        Pageable paymentsPage = PageRequest.of(0, size);
        Pageable deliveryPage = PageRequest.of(0, size);

        when(commentRepository.findAll(commentsPage)).thenReturn(new PageImpl<>(List.of(), commentsPage, 0));
        when(orderRepository.findAll(ordersPage)).thenReturn(new PageImpl<>(List.of(), ordersPage, 0));
        when(paymentRepository.findByPaymentStatus(com.quadzone.payment.PaymentStatus.COMPLETED, paymentsPage))
                .thenReturn(new PageImpl<>(List.of(), paymentsPage, 0));
        when(deliveryRepository.findAll(deliveryPage)).thenReturn(new PageImpl<>(List.of(), deliveryPage, 0));

        mockMvc.perform(get("/api/v1/admin/news").param("size", String.valueOf(size))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
