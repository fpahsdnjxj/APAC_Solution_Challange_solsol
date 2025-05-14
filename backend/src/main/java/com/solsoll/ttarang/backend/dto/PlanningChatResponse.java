package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PlanningChatResponse {
    @JsonProperty("chat_id")
    private Long chatId;
    private String title;
    private List<String> keywords;
}

