package com.solsoll.ttarang.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatRequestDTO {
    private String contentText;
    private List<String> imageUrls;
}
