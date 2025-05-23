package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class ExportResponseDto {
    private String type;
    private String content;
    @JsonProperty("image_urls")
    private List<String> imageUrls;
    @JsonProperty("link_urls")
    private List<String> linkUrls;
    private LocalDateTime createdAt;
}

