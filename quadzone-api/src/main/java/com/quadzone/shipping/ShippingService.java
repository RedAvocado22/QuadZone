package com.quadzone.shipping;

import com.quadzone.shipping.dto.ShippingCalculationRequest;
import com.quadzone.shipping.dto.ShippingCalculationResponse;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.*;

@Service
public class ShippingService {

    private static final Logger log = LoggerFactory.getLogger(ShippingService.class);
    private final RestTemplate restTemplate;

    @Value("${openrouteservice.api.key:eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU5NmI5NzNiZjc4ZTRmYWM5ZDRkZDA1MGI0OGVlNjliIiwiaCI6Im11cm11cjY0In0=}")
    private String orsKey;

    @Value("${openrouteservice.api.url:https://api.openrouteservice.org}")
    private String orsUrl;

    // FPT Hoa Lạc
    private static final double STORE_LON = 105.5255;
    private static final double STORE_LAT = 21.0133;

    private static final double INNER_CITY_FREE_KM = 1.0;
    private static final double DISCOUNTED_KM_THRESHOLD = 10.0;
    private static final double DISCOUNTED_RATE = 3;
    private static final double STANDARD_RATE = 4;
    private static final double HANDLING_FEE = 10;
    private static final double MINIMUM_COST = 10;

    public ShippingService() {
        this.restTemplate = new RestTemplate();
    }

    @PostConstruct
    public void init() {
        log.info("ORS Key: {}", orsKey != null);
    }

    // ========= MAIN FLOW =========

    public ShippingCalculationResponse calculateShipping(ShippingCalculationRequest req) {
        try {
            String rawAddress = buildAddress(req);
            String normalizedAddress = normalizeAddress(rawAddress);
            log.info("📍 Full address (normalized): {}", normalizedAddress);

            double[] coords = geocode(normalizedAddress);
            if (coords == null) {
                return new ShippingCalculationResponse(
                        MINIMUM_COST,
                        "Cannot geocode — using minimum shipping"
                );
            }

            double km = distance(coords[0], coords[1]);
            if (km < 0) {
                return new ShippingCalculationResponse(
                        MINIMUM_COST,
                        "Cannot calculate distance — using minimum shipping"
                );
            }

            double cost = calculateShippingFee(km);
            return new ShippingCalculationResponse(cost, message(km, cost));

        } catch (Exception e) {
            log.error("❌ Shipping error", e);
            return new ShippingCalculationResponse(MINIMUM_COST, "System error");
        }
    }

    // ========= ADDRESS BUILDER =========

    private String buildAddress(ShippingCalculationRequest req) {
        return String.join(", ",
                optional(req.address()),
                optional(req.apartment()),
                optional(req.block()),
                optional(req.district()),
                optional(req.city()),
                "Vietnam"
        );
    }

    private String optional(String s) {
        return s == null ? "" : s.trim();
    }

    // Remove dấu để Pelias không hiểu sai
    private String normalizeAddress(String input) {
        String noAccent = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return noAccent.replaceAll("[^a-zA-Z0-9 ,-/]", "");
    }

    // ========= GEOCODING (ORS + fallback Nominatim) =========

    private double[] geocode(String address) {
        return nominatimGeocode(address);
    }

    // ========= NOMINATIM FALLBACK =========

    private double[] nominatimGeocode(String address) {
        try {
            String url = "https://nominatim.openstreetmap.org/search?q=" +
                    URLEncoder.encode(address, StandardCharsets.UTF_8) +
                    "&format=json&limit=1";

            ResponseEntity<List> resp = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), List.class
            );

            if (resp.getBody() == null || resp.getBody().isEmpty()) return null;

            Map<String, Object> obj = (Map<String, Object>) resp.getBody().get(0);

            double lat = Double.parseDouble(obj.get("lat").toString());
            double lon = Double.parseDouble(obj.get("lon").toString());

            log.info("📌 Nominatim result: {}, {}", lon, lat);
            return new double[]{lon, lat};

        } catch (Exception e) {
            log.error("❌ Nominatim error", e);
            return null;
        }
    }

    // ========= MATRIX DISTANCE =========

    private double distance(double lon, double lat) {
        try {
            HttpHeaders h = new HttpHeaders();
            h.set("Authorization", orsKey);
            h.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> req = new HashMap<>();
            req.put("locations", List.of(
                    List.of(STORE_LON, STORE_LAT),
                    List.of(lon, lat)
            ));
            req.put("metrics", new String[]{"distance"});
            req.put("sources", new int[]{0});
            req.put("destinations", new int[]{1});
            req.put("units", "km");

            ResponseEntity<Map> resp = restTemplate.exchange(
                    orsUrl + "/v2/matrix/driving-car",
                    HttpMethod.POST,
                    new HttpEntity<>(req, h),
                    Map.class
            );

            List<List<Double>> dist = (List<List<Double>>) resp.getBody().get("distances");
            return dist.get(0).get(0) / 1000.0;

        } catch (Exception e) {
            log.error("❌ Distance error", e);
            return -1;
        }
    }

    // ========= COST =========

    private double calculateShippingFee(double km) {
        if (km <= INNER_CITY_FREE_KM) return 0;

        double cost = HANDLING_FEE;
        double remaining = km - INNER_CITY_FREE_KM;

        double discountedBand = DISCOUNTED_KM_THRESHOLD - INNER_CITY_FREE_KM;

        if (remaining > discountedBand) {
            cost += discountedBand * DISCOUNTED_RATE;
            cost += (km - DISCOUNTED_KM_THRESHOLD) * STANDARD_RATE;
        } else {
            cost += remaining * DISCOUNTED_RATE;
        }

        return cost;
    }

    private String message(double km, double cost) {
        if (cost == 0) return "Free ship";
        return cost + " (distance " + km + " km)";
    }
}
