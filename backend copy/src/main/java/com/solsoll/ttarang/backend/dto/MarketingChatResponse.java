package com.solsoll.ttarang.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
@Getter

@AllArgsConstructor
public class MarketingChatResponse {
    private Long chatid;
    private String title;
    private List<String> keyword;
}