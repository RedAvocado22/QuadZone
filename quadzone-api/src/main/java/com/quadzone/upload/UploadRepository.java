package com.quadzone.upload;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UploadRepository extends JpaRepository<Upload, Long> {
    Optional<Upload> findByImgbbId(String imgbbId);
    Page<Upload> findByFileNameContainingIgnoreCase(String search, Pageable pageable);
}
