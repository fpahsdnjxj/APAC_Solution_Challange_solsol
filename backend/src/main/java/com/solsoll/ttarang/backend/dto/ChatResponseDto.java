package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDto {
    @JsonProperty("sender_role")
    private String senderRole;
    @JsonProperty("content_text")// "ai"
    private String contentText;     // AI가 생성한 텍스트
    private List<String> links;     // 관련 링크들
}