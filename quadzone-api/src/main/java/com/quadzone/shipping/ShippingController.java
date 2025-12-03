package com.quadzone.shipping;

import com.quadzone.shipping.dto.ShippingCalculationRequest;
import com.quadzone.shipping.dto.ShippingCalculationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @PostMapping("/calculate")
    public ResponseEntity<ShippingCalculationResponse> calculate(
            @Valid @RequestBody ShippingCalculationRequest request
    ) {
        ShippingCalculationResponse response = shippingService.calculateShipping(request);
        return ResponseEntity.ok(response);
    }
}

