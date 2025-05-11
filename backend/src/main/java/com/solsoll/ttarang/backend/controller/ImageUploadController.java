package com.solsoll.ttarang.backend.controller;

import com.solsoll.ttarang.backend.service.ImageUploadService;
import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping(value = "/upload/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails,
            @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }

        String url = imageUploadService.store(file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}