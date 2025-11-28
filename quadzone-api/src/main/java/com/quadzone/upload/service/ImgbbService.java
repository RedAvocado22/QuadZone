package com.quadzone.upload.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import java.util.Base64;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
public class ImgbbService {

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String uploadUrl = "https://api.imgbb.com/1/upload";

    public ImgbbService(RestTemplate restTemplate, @Value("${imgbb.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    public ImgbbUploadResponse uploadImage(MultipartFile file) throws IOException {
        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("key", apiKey);
        body.add("image", base64Image);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<ImgbbApiResponse> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    ImgbbApiResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                ImgbbApiResponse apiResponse = response.getBody();
                if (apiResponse.getSuccess() && apiResponse.getData() != null) {
                    return apiResponse.getData();
                } else {
                    throw new RuntimeException("ImgBB upload failed: " +
                        (apiResponse.getError() != null ? apiResponse.getError().getMessage() : "Unknown error"));
                }
            } else {
                throw new RuntimeException("ImgBB upload failed with status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error uploading image to ImgBB", e);
            throw new RuntimeException("Failed to upload image to ImgBB: " + e.getMessage(), e);
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImgbbApiResponse {
        @JsonProperty("success")
        private Boolean success;

        @JsonProperty("status")
        private Integer status;

        @JsonProperty("data")
        private ImgbbUploadResponse data;

        @JsonProperty("error")
        private ImgbbError error;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImgbbError {
        @JsonProperty("message")
        private String message;

        @JsonProperty("code")
        private Integer code;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImgbbUploadResponse {
        @JsonProperty("id")
        private String id;

        @JsonProperty("title")
        private String title;

        @JsonProperty("url_viewer")
        private String urlViewer;

        @JsonProperty("url")
        private String url;

        @JsonProperty("display_url")
        private String displayUrl;

        @JsonProperty("size")
        private Long size;

        @JsonProperty("time")
        private String time;

        @JsonProperty("expiration")
        private String expiration;

        @JsonProperty("thumb")
        private ImgbbThumb thumb;

        @JsonProperty("delete_url")
        private String deleteUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImgbbThumb {
        @JsonProperty("filename")
        private String filename;

        @JsonProperty("name")
        private String name;

        @JsonProperty("mime")
        private String mime;

        @JsonProperty("extension")
        private String extension;

        @JsonProperty("url")
        private String url;
    }
}
