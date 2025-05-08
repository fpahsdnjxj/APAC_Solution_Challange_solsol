package com.solsoll.ttarang.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlanningChatRequest {
    private String title;
    private String detailInfo;
    private String location;
    private List<String> imageUrls;
    private List<String> keywords;
    private String availableDates; // "2025-04-20 ~ 2025-05-05" 형식
    private String duration;
    private int price;
    private String policy;
}