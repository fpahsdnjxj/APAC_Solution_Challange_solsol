package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class ImageUploadService {

    // S3Client is made optional and will only be injected if the 'prod' profile is active
    @Autowired(required = false)
    private S3Client s3Client;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Value("${cloud.aws.s3.bucket:}")
    private String bucket;

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public String store(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isImageFile(originalFilename)) {
            throw new CustomException(ErrorCode.UNSUPPORTED_MEDIA_TYPE);
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String newFilename = UUID.randomUUID() + extension;

        // Use S3 if profile is 'prod' and S3Client is available
        if ("prod".equals(activeProfile) && s3Client != null) {
            return storeS3(file, newFilename);
        } else {
            // Otherwise, use local storage
            return storeLocal(file, newFilename);
        }
    }

    private String storeS3(MultipartFile file, String newFilename) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(newFilename)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return s3Client.utilities().getUrl(builder -> builder.bucket(bucket).key(newFilename)).toExternalForm();
        } catch (IOException e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to upload file to S3");
        }
    }

    private String storeLocal(MultipartFile file, String newFilename) {
        File dest = new File(UPLOAD_DIR + newFilename);
        dest.getParentFile().mkdirs();
        try {
            file.transferTo(dest);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to store file locally");
        }
        return "/uploads/" + newFilename;
    }

    private boolean isImageFile(String filename) {
        String lower = filename.toLowerCase();
        return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png");
    }
}