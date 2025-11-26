package com.quadzone.upload.service;

import com.quadzone.global.dto.PagedResponse;
import com.quadzone.upload.Upload;
import com.quadzone.upload.UploadRepository;
import com.quadzone.upload.dto.UploadResponse;
import com.quadzone.upload.dto.UploadUpdateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UploadService {

    private final UploadRepository uploadRepository;
    private final ImgbbService imgbbService;

    @Transactional
    public UploadResponse uploadImage(MultipartFile file, String description) {
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("File must be an image");
            }

            // Upload to ImgBB
            ImgbbService.ImgbbUploadResponse imgbbResponse = imgbbService.uploadImage(file);

            // Create upload record
            Upload upload = Upload.builder()
                    .fileName(file.getOriginalFilename())
                    .imageUrl(imgbbResponse.getUrl())
                    .thumbnailUrl(imgbbResponse.getThumb() != null ? imgbbResponse.getThumb().getUrl() : imgbbResponse.getUrl())
                    .description(description != null ? description : "")
                    .fileSize(file.getSize())
                    .mimeType(contentType)
                    .imgbbId(imgbbResponse.getId())
                    .build();

            Upload savedUpload = uploadRepository.save(upload);
            return UploadResponse.from(savedUpload);

        } catch (Exception e) {
            log.error("Error uploading image", e);
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    public PagedResponse<UploadResponse> getAllUploads(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Upload> uploadPage;

        if (search != null && !search.trim().isEmpty()) {
            uploadPage = uploadRepository.findByFileNameContainingIgnoreCase(search, pageable);
        } else {
            uploadPage = uploadRepository.findAll(pageable);
        }

        var uploads = uploadPage.getContent().stream()
                .map(UploadResponse::from)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                uploads,
                uploadPage.getTotalElements(),
                uploadPage.getNumber(),
                uploadPage.getSize()
        );
    }

    public UploadResponse getUploadById(Long id) {
        Upload upload = uploadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Upload not found with id: " + id));
        return UploadResponse.from(upload);
    }

    @Transactional
    public UploadResponse updateUpload(Long id, UploadUpdateRequest request) {
        Upload upload = uploadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Upload not found with id: " + id));

        if (request.description() != null) {
            upload.setDescription(request.description());
        }

        Upload updatedUpload = uploadRepository.save(upload);
        return UploadResponse.from(updatedUpload);
    }

    @Transactional
    public void deleteUpload(Long id) {
        if (!uploadRepository.existsById(id)) {
            throw new RuntimeException("Upload not found with id: " + id);
        }
        uploadRepository.deleteById(id);
    }

}
