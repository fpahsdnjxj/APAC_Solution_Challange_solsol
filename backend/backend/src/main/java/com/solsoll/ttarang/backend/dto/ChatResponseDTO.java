package com.solsoll.ttarang.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDTO {
    private String senderRole;      // "ai"
    private String contentText;     // AI가 생성한 텍스트
    private List<String> links;     // 관련 링크들
}