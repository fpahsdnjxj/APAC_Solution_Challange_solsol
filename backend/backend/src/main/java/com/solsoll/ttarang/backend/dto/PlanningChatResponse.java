package com.solsoll.ttarang.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PlanningChatResponse {
    private String chatId;
    private String title;
    private List<String> keywords;
}

