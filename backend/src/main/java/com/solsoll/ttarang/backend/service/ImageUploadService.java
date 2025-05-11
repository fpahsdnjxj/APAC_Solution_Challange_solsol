package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class ImageUploadService {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public String store(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isImageFile(originalFilename)) {
            throw new CustomException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String newFilename = UUID.randomUUID() + extension;
        File dest = new File(UPLOAD_DIR + newFilename);

        dest.getParentFile().mkdirs(); // 디렉토리 없으면 생성
        try {
            file.transferTo(dest);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }

        return "/uploads/" + newFilename; // static 경로 기준 반환
    }

    private boolean isImageFile(String filename) {
        String lower = filename.toLowerCase();
        return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png");
    }
}