package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.dto.ChatRequestDTO;
import com.solsoll.ttarang.backend.dto.PlanningChatRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIIntegrationService {

    public AIChatCreateResponse processChat(PlanningChatRequest request) {
        // AI와 실제 통신하는 로직 추가
        // Mock 데이터
        return new AIChatCreateResponse("sdfsadj", List.of("키워드1", "키워드2", "키워드3"));
    }

    public AIResponse sendMessageToAI(Long chatid, ChatRequestDTO request){
        return new AIResponse("hello", List.of());
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class AIChatCreateResponse {
    private String chatId;
    private List<String> keywords;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class AIResponse{
    private String content;
    private List<String> links;
}
