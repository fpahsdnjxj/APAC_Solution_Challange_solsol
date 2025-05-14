package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
@Getter

@AllArgsConstructor
public class MarketingChatResponse {
    @JsonProperty("chat_id")
    private Long chatId;
    private String title;
    private List<String> keyword;
}