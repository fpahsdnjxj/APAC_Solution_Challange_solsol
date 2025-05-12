package com.solsoll.ttarang.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.solsoll.ttarang.backend.domain.Export;
import com.solsoll.ttarang.backend.domain.Message;
import com.solsoll.ttarang.backend.domain.ProjectForm;
import com.solsoll.ttarang.backend.dto.AIMessageRequestDto;
import com.solsoll.ttarang.backend.dto.AIMarketingRequestDto;
import com.solsoll.ttarang.backend.dto.PlanningChatRequest;
import com.solsoll.ttarang.backend.dto.SimpleMessageDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AIIntegrationService {

    private final WebClient webClient=WebClient.create();
    private final MessageService messageService;


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


    public AIResponse sendMessageToAI(AIMessageRequestDto request){
        AIResponse response=webClient.post()
                .uri("http://localhost:8000/api/ai/message")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue( request)
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
    private SimpleMessageDto message;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class ExportAIResponse {
    private String content;
    private List<String> links;
    private List<String> imageUrls;
}
