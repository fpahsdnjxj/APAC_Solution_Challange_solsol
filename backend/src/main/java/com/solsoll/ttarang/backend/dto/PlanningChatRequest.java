package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class PlanningChatRequest {
    private String title;
    @JsonProperty("detail_info")
    private String detailInfo;
    private String location;
    @JsonProperty("image_urls")
    private List<String> imageUrls;
    private List<String> keywords;
    @JsonProperty("available_dates")
    private String availableDates; // "2025-04-20 ~ 2025-05-05" 형식
    private String duration;
    private int price;
    private String policy;
}