package com.solsoll.ttarang.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class ExportResponseDto {
    private String type;
    private String content;
    private List<String> imageUrls;
    private List<String> linkUrls;
    private LocalDateTime createdAt;
}

