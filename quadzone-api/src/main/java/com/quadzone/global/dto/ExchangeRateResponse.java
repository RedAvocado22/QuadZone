package com.quadzone.global.dto;

import lombok.Data;


import java.util.Map;

@Data
public class ExchangeRateResponse {
    private String result;
    private String base_code;
    private Map<String, Double> conversion_rates;
}
