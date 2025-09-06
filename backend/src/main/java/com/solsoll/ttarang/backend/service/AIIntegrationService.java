package com.solsoll.ttarang.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.solsoll.ttarang.backend.domain.Export;
import com.solsoll.ttarang.backend.domain.Message;
import com.solsoll.ttarang.backend.domain.ProjectForm;
import com.solsoll.ttarang.backend.dto.*;
import lombok.*;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Service
public class AIIntegrationService {

    private final WebClient webClient;
    private final MessageService messageService;
    private final String aiServerUrl; // AI 서버의 기본 주소를 저장할 필드

    // @Value 어노테이션으로 properties의 값을 주입받습니다.
    public AIIntegrationService(WebClient.Builder webClientBuilder,
                                MessageService messageService,
                                @Value("${ai.server.url}") String aiServerUrl) {
        this.webClient = webClientBuilder.baseUrl(aiServerUrl).build();
        this.messageService = messageService;
        this.aiServerUrl = aiServerUrl;
    }


    public AIChatCreateResponse processPlanningChat(PlanningChatRequest request) {
        String fullUrl = "/api/ai/planning";
        AIChatCreateResponse response=webClient.post()
                .uri(fullUrl)
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
        String fullUrl = "/api/ai/marketing";
        AIChatCreateResponse response=webClient.post()
                .uri(fullUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(marketingRequestDto)
                .retrieve()
                .bodyToMono(AIChatCreateResponse.class)
                .block();
        return response;
    }


    public AIResponse sendMessageToAI(AIMessageRequestDto request){
        String fullUrl =  "/api/ai/message";
        AIResponse response=webClient.post()
                .uri(fullUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue( request)
                .retrieve()
                .bodyToMono(AIResponse.class)
                .block();
        return response;
    }

    public ExportAIResponse generatePlanningFinalExport(AIPlanningExportRequestDto exportRequestDto) {
        String fullUrl =  "/api/ai/planning_export";
        ExportAIResponse response=webClient.post()
                .uri(fullUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(exportRequestDto)
                .retrieve()
                .bodyToMono(ExportAIResponse.class)
                .block();
        return response;
    }

    public ExportAIResponse generateMarketingFinalExport(AIMarketingExportRequestDto exportRequestDto) {
        String fullUrl =  "/api/ai/marketing_export";
        ExportAIResponse response=webClient.post()
                .uri(fullUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(exportRequestDto)
                .retrieve()
                .bodyToMono(ExportAIResponse.class)
                .block();
        return response;
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
