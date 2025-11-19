package com.quadzone.global;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public")
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    public ExchangeRateController(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }


    @GetMapping("/rate")
    public Double rateUsdToVnd() {
        return exchangeRateService.getUsdToVnd();
    }
}

