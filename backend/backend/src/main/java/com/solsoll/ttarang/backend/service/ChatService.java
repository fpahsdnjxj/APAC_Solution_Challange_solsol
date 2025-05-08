package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.common.Chattype;
import com.solsoll.ttarang.backend.common.Senderrole;
import com.solsoll.ttarang.backend.domain.Chat;
import com.solsoll.ttarang.backend.domain.Message;
import com.solsoll.ttarang.backend.domain.ProjectForm;
import com.solsoll.ttarang.backend.domain.User;
import com.solsoll.ttarang.backend.dto.ChatRequestDTO;
import com.solsoll.ttarang.backend.dto.ChatResponseDTO;
import com.solsoll.ttarang.backend.dto.PlanningChatRequest;
import com.solsoll.ttarang.backend.dto.PlanningChatResponse;
import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import com.solsoll.ttarang.backend.repository.ChatRepository;
import com.solsoll.ttarang.backend.repository.MessageRepository;
import com.solsoll.ttarang.backend.repository.ProjectFormRepository;
import com.solsoll.ttarang.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public List<Chat> getIncompleteChatsByUserId(Long userId) {
        return chatRepository.findByUserIdAndCompletedFalse(userId);
    }

    public Optional<Chat> findChatById(Long chatId) {
        return chatRepository.findById(chatId);
    }

    public PlanningChatResponse createPlanningChat(Long userId, PlanningChatRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "User not found"));

        AIChatCreateResponse aiResponse = aiIntegrationService.processChat(request);

        Chat chat = new Chat();
        chat.setTitle(request.getTitle());
        chat.setKeywords(aiResponse.getKeywords());
        chat.setType(Chattype.planning); // 예: 기획 타입으로 설정
        chat.setUser(user); // 만약 유저 정보도 받아왔다면
        chatRepository.save(chat); // save 이후 chat.id가 생성됨

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
                aiResponse.getChatId(),
                request.getTitle(),
                aiResponse.getKeywords()
        );
    }

    public ChatResponseDTO processMessage(Chat chat, ChatRequestDTO request) {

        Message userMessage = new Message();
        userMessage.setChat(chat);
        userMessage.setSenderRole(Senderrole.user);
        userMessage.setContent(request.getContentText());
        userMessage.setImageUrls(request.getImageUrls());
        messageRepository.save(userMessage);

        AIResponse aiResult = aiIntegrationService.sendMessageToAI(chat.getId(), request);

        Message aiMessage = new Message();
        aiMessage.setChat(chat);
        aiMessage.setSenderRole(Senderrole.ai);
        aiMessage.setContent(aiResult.getContent());
        aiMessage.setLinks(aiResult.getLinks());
        messageRepository.save(aiMessage);

        return new ChatResponseDTO(
                "ai",
                aiResult.getContent(),
                aiResult.getLinks()
        );
    }

}
