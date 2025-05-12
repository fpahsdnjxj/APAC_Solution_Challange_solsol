package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.domain.Export;
import com.solsoll.ttarang.backend.domain.Message;
import com.solsoll.ttarang.backend.domain.ProjectForm;
import com.solsoll.ttarang.backend.dto.AIMarketingRequestDto;
import com.solsoll.ttarang.backend.dto.ChatRequestDto;
import com.solsoll.ttarang.backend.dto.PlanningChatRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class AIIntegrationService {

    WebClient webClient=WebClient.create();

    public AIChatCreateResponse processPlanningChat(PlanningChatRequest request) {
        AIChatCreateResponse response=webClient.post()
                .uri("http://localhost:8000/api/ai/planning")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AIChatCreateResponse.class)
                .block();
        return response;
    }

    public AIChatCreateResponse processMarketingChat(Export export) {
        AIMarketingRequestDto marketingRequestDto=new AIMarketingRequestDto(
                export.getContent(),
                export.getImageUrls(),
                export.getLinks()
        );
        AIChatCreateResponse response=webClient.post()
                .uri("http://localhost:8000/api/ai/marketing")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(marketingRequestDto)
                .retrieve()
                .bodyToMono(AIChatCreateResponse.class)
                .block();
        return response;
    }


    public AIResponse sendMessageToAI(Long chatid, ChatRequestDto request){
        AIResponse response=webClient.post()
                .uri("http://localhost:8000/api/ai/message")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AIResponse.class)
                .block();
        return response;
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
