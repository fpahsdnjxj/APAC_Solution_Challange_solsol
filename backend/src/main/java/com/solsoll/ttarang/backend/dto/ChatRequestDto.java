package com.solsoll.ttarang.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatRequestDto {
    private String contentText;
    private List<String> imageUrls;
}
