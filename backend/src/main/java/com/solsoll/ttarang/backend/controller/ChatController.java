package com.solsoll.ttarang.backend.controller;

import com.solsoll.ttarang.backend.domain.Chat;
import com.solsoll.ttarang.backend.domain.Message;
import com.solsoll.ttarang.backend.domain.User;
import com.solsoll.ttarang.backend.dto.ChatRequestDto;
import com.solsoll.ttarang.backend.dto.ChatResponseDto;
import com.solsoll.ttarang.backend.dto.PlanningChatRequest;
import com.solsoll.ttarang.backend.dto.PlanningChatResponse;
import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import com.solsoll.ttarang.backend.repository.UserRepository;
import com.solsoll.ttarang.backend.service.ChatService;
import com.solsoll.ttarang.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor

public class ChatController {

    private final ChatService chatService;
    private final MessageService messageService;
    private final UserRepository userRepository;


    @GetMapping("/chatlist")
    public ResponseEntity<?> getChatList(@AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        try {
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            List<Chat> chats = chatService.getIncompleteChatsByUserId(userId);
            if(chats == null || chats.isEmpty()) {
                return ResponseEntity.ok(Map.of("chat_list", Collections.emptyList()));
            }
            List<Map<String, Object>> chatList = chats.stream()
                    .map(c -> Map.of(
                            "id", c.getId(),
                            "title", c.getTitle(),
                            "type", c.getType().toString(),
                            "keywords", c.getKeywords(),
                            "update_date", c.getCreatedDate()
                    )).toList();
            return ResponseEntity.ok(Map.of("chat_list", chatList));
        } catch (CustomException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Access token is missing or invalid"));
        }
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
    }

    @PostMapping("/planning_chat")
    public ResponseEntity<?> createPlanningChat( @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails,
                                                 @RequestBody PlanningChatRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        PlanningChatResponse response = chatService.createPlanningChat(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{chatid}")
    public ResponseEntity<?> sendMessageToAI(
            @PathVariable("chatid") Long chatId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails,
            @RequestHeader("Authorization") String authorization,
            @RequestBody ChatRequestDto request
    ) {
        try {
            Chat chat = chatService.findChatById(chatId)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Chat with id '" + chatId + "' not found"));

            ChatResponseDto aiResponse = chatService.processMessage(chat, request);

            return ResponseEntity.ok(Map.of(
                    "sender_role", "ai",
                    "content_text", aiResponse.getContentText(),
                    "links", aiResponse.getLinks()
            ));

        } catch (CustomException e) {
            // 예외에 따른 상태 코드와 메시지 반환
            return ResponseEntity.status(e.getErrorCode().getStatus())
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // 기타 예외 처리 (500 Internal Server Error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    @GetMapping("/{chatid}")
    public ResponseEntity<?> getChatMessages(
            @PathVariable("chatid") Long chatId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails
    ) {
        try {
            Chat chat = chatService.findChatById(chatId)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Chat with id '" + chatId + "' not found"));

            List<Message> messages = messageService.findMessagesByChat(chat);

            List<Map<String, Object>> messageList = messages.stream()
                    .map(m -> Map.of(
                            "sender_role", m.getSenderRole() != null ? m.getSenderRole().name().toLowerCase() : "",
                            "content_text", m.getContent() != null ? m.getContent() : "",
                            "links", m.getLinks() != null ? m.getLinks() : List.of(),
                            "image_urls", m.getImageUrls() != null ? m.getImageUrls() : List.of()
                    )).toList();

            return ResponseEntity.ok(Map.of("message_list", messageList));

        } catch (CustomException e) {
            return ResponseEntity.status(e.getErrorCode().getStatus())
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    @PatchMapping("/{chatid}/chat_complete")
    public ResponseEntity<?> completeChat(
            @PathVariable("chatid") Long chatId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails
    ) {
        try {
            Long userId = getUserIdFromEmail(userDetails.getUsername());

            chatService.markChatAsFinished(chatId, userId);

            return ResponseEntity.ok(Map.of(
                    "message", "chat id " + chatId + " is finished"
            ));

        } catch (CustomException e) {
            e.printStackTrace();
            return ResponseEntity.status(e.getErrorCode().getStatus())
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }
}