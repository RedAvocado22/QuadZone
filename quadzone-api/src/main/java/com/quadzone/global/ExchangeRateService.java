package com.quadzone.global;

import com.quadzone.global.dto.ExchangeRateResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class ExchangeRateService {

    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateService.class);
    
    private static final Double FALLBACK_USD_TO_VND = 25000.0;

    private final RestTemplate restTemplate;

    public ExchangeRateService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Double getUsdToVnd() {
        String url = "https://v6.exchangerate-api.com/v6/3cdce46c2eaa770628c768db/latest/USD";

        try {
            logger.info("Fetching exchange rate from: {}", url);
            
            ExchangeRateResponse response =
                    restTemplate.getForObject(url, ExchangeRateResponse.class);

            if (response == null) {
                logger.warn("Exchange rate API returned null response. Using fallback rate: {}", FALLBACK_USD_TO_VND);
                return FALLBACK_USD_TO_VND;
            }

            if (response.getConversion_rates() == null) {
                logger.warn("Exchange rate API response has null conversion_rates. Using fallback rate: {}", FALLBACK_USD_TO_VND);
                return FALLBACK_USD_TO_VND;
            }

            Double vndRate = response.getConversion_rates().get("VND");

            if (vndRate == null) {
                logger.warn("VND rate not found in response. Using fallback rate: {}", FALLBACK_USD_TO_VND);
                return FALLBACK_USD_TO_VND;
            }

            logger.info("Successfully fetched USD to VND rate: {}", vndRate);
            return vndRate;

        } catch (RestClientException e) {
            logger.error("Error calling exchange rate API: {}", e.getMessage(), e);
            logger.warn("Using fallback exchange rate: {}", FALLBACK_USD_TO_VND);
            return FALLBACK_USD_TO_VND;
        } catch (Exception e) {
            logger.error("Unexpected error when fetching exchange rate: {}", e.getMessage(), e);
            logger.warn("Using fallback exchange rate: {}", FALLBACK_USD_TO_VND);
            return FALLBACK_USD_TO_VND;
        }
    }

}

