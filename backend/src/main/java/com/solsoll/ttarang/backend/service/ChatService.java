package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.common.Chattype;
import com.solsoll.ttarang.backend.common.Senderrole;
import com.solsoll.ttarang.backend.domain.*;
import com.solsoll.ttarang.backend.dto.*;
import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import com.solsoll.ttarang.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final ChatRepository chatRepository;
    private final AIIntegrationService aiIntegrationService;
    private final MessageRepository messageRepository;
    private final ProjectFormRepository projectFormRepository;
    private final UserRepository userRepository;
    private final ExportRepository exportRepository;
    private final MessageService messageService;

    public List<Chat> getIncompleteChatsByUserId(Long userId) {
        return chatRepository.findByUserIdAndCompletedFalse(userId);
    }

    public Optional<Chat> findChatById(Long chatId) {
        return chatRepository.findById(chatId);
    }

    public PlanningChatResponse createPlanningChat(Long userId, PlanningChatRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "User not found"));

        AIChatCreateResponse aiResponse = aiIntegrationService.processPlanningChat(request);

        Chat chat = new Chat();
        chat.setTitle(request.getTitle());
        chat.setKeywords(aiResponse.getKeywords());
        chat.setType(Chattype.planning);
        chat.setUser(user);
        chat.setCompleted(false);
        chatRepository.save(chat);

        ProjectForm form = new ProjectForm();
        form.setChat(chat);
        form.setTitle(request.getTitle());
        form.setDetail_info(request.getDetailInfo());
        form.setLocation(request.getLocation());
        form.setAvailable_dates(request.getAvailableDates());
        form.setDuration(request.getDuration());
        form.setPrice(request.getPrice());
        form.setPolicy(request.getPolicy());
        projectFormRepository.save(form);
        form.setPhoto_urls(request.getImageUrls());
        form.setKeywords(request.getKeywords());
        projectFormRepository.save(form);

        return new PlanningChatResponse(
                chat.getId(),
                aiResponse.getTitle(),
                aiResponse.getKeywords()
        );
    }

    public MarketingChatResponse createMarketingChat(Long userId, Long chatId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "User not found"));

        Chat originalChat = chatRepository.findById(chatId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Original chat not found"));

        Export export = exportRepository.findByChat(originalChat)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Export not found for chat"));

        AIChatCreateResponse aiResponse = aiIntegrationService.processMarketingChat(export);

        Chat chat = new Chat();
        chat.setTitle(export.getTitle());
        chat.setKeywords(aiResponse.getKeywords());
        chat.setType(Chattype.marketing);
        chat.setUser(user);
        chatRepository.save(chat);

        return new MarketingChatResponse(
                chat.getId(),
                chat.getTitle(),
                chat.getKeywords()
        );
    }

    public ChatResponseDto processMessage(Chat chat, ChatRequestDto request) {

        Message userMessage = new Message();
        userMessage.setChat(chat);
        userMessage.setSenderRole(Senderrole.user);
        userMessage.setContent(request.getContentText());
        userMessage.setImageUrls(request.getImageUrls());
        messageRepository.save(userMessage);
        SimpleMessageDto currentmessage=new SimpleMessageDto(
                userMessage.getSenderRole().name(),
                userMessage.getContent(),
                Collections.emptyList(),
                userMessage.getImageUrls()
        );
        List<SimpleMessageDto> previous_message= new ArrayList<>();;
        messageService.findMessagesByChat(chat).forEach(message -> {
                if (message.getSenderRole() != null && message.getContent() != null) {
                    SimpleMessageDto dto = new SimpleMessageDto();
                    dto.setSenderRole(message.getSenderRole().name());
                    dto.setContentText(message.getContent());
                    dto.setLinks(message.getLinks() != null ? message.getLinks() : new ArrayList<>());
                    dto.setImageUrls(message.getImageUrls() != null ? message.getImageUrls() : new ArrayList<>());
                    previous_message.add(dto);
            }
        });
        System.out.println(previous_message);
        System.out.println(currentmessage);
        AIMessageRequestDto aimessagerequest=new AIMessageRequestDto(
            false,
                previous_message,
                currentmessage
        );
        AIResponse aiResult = aiIntegrationService.sendMessageToAI(aimessagerequest);

        Message aiMessage = new Message();
        aiMessage.setChat(chat);
        aiMessage.setSenderRole(Senderrole.ai);
        aiMessage.setContent(aiResult.getMessage().getContentText());
        aiMessage.setLinks(aiResult.getMessage().getLinks());
        messageRepository.save(aiMessage);

        return new ChatResponseDto(
                "ai",
                aiResult.getMessage().getContentText(),
                aiResult.getMessage().getLinks()
        );
    }

    public void  markChatAsFinished(Long chatId, Long userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Chat with id '" + chatId + "' not found"));

        if (!chat.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        List<SimpleMessageDto> previous_message= new ArrayList<>();;
        messageService.findMessagesByChat(chat).forEach(message -> {
            if (message.getSenderRole() != null && message.getContent() != null) {
                SimpleMessageDto dto = new SimpleMessageDto();
                dto.setSenderRole(message.getSenderRole().name());
                dto.setContentText(message.getContent());
                dto.setLinks(message.getLinks() != null ? message.getLinks() : new ArrayList<>());
                dto.setImageUrls(message.getImageUrls() != null ? message.getImageUrls() : new ArrayList<>());
                previous_message.add(dto);
            }
        });

        chat.setCompleted(true);
        chatRepository.save(chat);
        Chattype type = chat.getType();
        ExportAIResponse aiResult;

        if (type == Chattype.planning) {
            ProjectForm defaultInfo = projectFormRepository.findByChat(chat)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "No ProjectForm found for chat id " + chatId));
            PlanningChatRequest planningChatRequest = new PlanningChatRequest();
            planningChatRequest.setTitle(defaultInfo.getTitle());
            planningChatRequest.setLocation(defaultInfo.getLocation());
            planningChatRequest.setDetailInfo(defaultInfo.getDetail_info());
            planningChatRequest.setImageUrls(defaultInfo.getPhoto_urls());
            planningChatRequest.setKeywords(defaultInfo.getKeywords());
            planningChatRequest.setAvailableDates(defaultInfo.getAvailable_dates());

            try {
                planningChatRequest.setDuration(defaultInfo.getDuration());
            } catch (NumberFormatException e) {
                planningChatRequest.setDuration("no duration"); // or throw exception if required
            }
            planningChatRequest.setPrice((int) defaultInfo.getPrice());
            planningChatRequest.setPolicy(defaultInfo.getPolicy());

            AIPlanningExportRequestDto exportRequestDto = new AIPlanningExportRequestDto();
            exportRequestDto.setDefaultInfo(planningChatRequest);
            exportRequestDto.setCompleted(true);
            exportRequestDto.setPreviousMessageList(previous_message);

            aiResult =aiIntegrationService.generatePlanningFinalExport(exportRequestDto);


        } else if (type == Chattype.marketing) {
            Export defaultInfo = exportRepository.findByChat(chat)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "No Export found for chat id " + chatId));
            AIMarketingRequestDto aiMarketingRequest = new AIMarketingRequestDto();
            aiMarketingRequest.setContent(defaultInfo.getContent());
            aiMarketingRequest.setLinks(defaultInfo.getLinks());
            aiMarketingRequest.setImageUrls(defaultInfo.getImageUrls());
            AIMarketingExportRequestDto exportRequestDto = new AIMarketingExportRequestDto();
            exportRequestDto.setCompleted(true);
            exportRequestDto.setPreviousMessageList(previous_message);
            exportRequestDto.setDefaultInfo(aiMarketingRequest);
            aiResult =aiIntegrationService.generateMarketingFinalExport(exportRequestDto);

        } else {
            throw new CustomException(ErrorCode.BAD_REQUEST, "Invalid chat type for final export");
        }

        Export finalExport = new Export();
        finalExport.setChat(chat);
        finalExport.setContent(aiResult.getContent());
        finalExport.setType(type);
        finalExport.setTitle(chat.getTitle());
        exportRepository.save(finalExport);
        finalExport.setImageUrls(
                aiResult.getImageUrls() != null ? new ArrayList<>(aiResult.getImageUrls()) : new ArrayList<>()
        );
        finalExport.setLinks(
                aiResult.getLinks() != null ? new ArrayList<>(aiResult.getLinks()) : new ArrayList<>()
        );
        exportRepository.save(finalExport);
    }
}
