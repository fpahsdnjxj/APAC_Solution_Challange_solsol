package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ChatRequestDto {
    @JsonProperty("content_text")
    private String contentText;
    @JsonProperty("image_urls")
    private List<String> imageUrls;
}
