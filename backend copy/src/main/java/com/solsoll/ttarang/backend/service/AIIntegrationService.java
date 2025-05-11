package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.domain.Export;
import com.solsoll.ttarang.backend.domain.Message;
import com.solsoll.ttarang.backend.domain.ProjectForm;
import com.solsoll.ttarang.backend.dto.ChatRequestDto;
import com.solsoll.ttarang.backend.dto.PlanningChatRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIIntegrationService {

    public AIChatCreateResponse processPlanningChat(PlanningChatRequest request) {
        // AI와 실제 통신하는 로직 추가
        // Mock 데이터
        return new AIChatCreateResponse("sdfsadj", List.of("키워드1", "키워드2", "키워드3"));
    }

    public AIChatCreateResponse processMarketingChat(Export export) {
        // AI와 실제 통신하는 로직 추가
        // Mock 데이터
        return new AIChatCreateResponse("sdfsadj", List.of("키워드1", "키워드2", "키워드3"));
    }


    public AIResponse sendMessageToAI(Long chatid, ChatRequestDto request){
        return new AIResponse("hello", List.of());
    }

    public ExportAIResponse generatePlanningFinalExport(List<Message> messages, ProjectForm defaultInfo) {
        return new ExportAIResponse("export new things", List.of(), List.of());
    }

    public ExportAIResponse generateMarketingFinalExport(List<Message> messages, Export defaultInfo) {
        return new ExportAIResponse("export new things", List.of(), List.of());
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class AIChatCreateResponse {
    private String title;
    private List<String> keywords;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class AIResponse{
    private String content;
    private List<String> links;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class ExportAIResponse {
    private String content;
    private List<String> links;
    private List<String> imageUrls;
}
