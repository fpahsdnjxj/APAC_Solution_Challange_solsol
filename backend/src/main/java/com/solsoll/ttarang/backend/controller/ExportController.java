package com.solsoll.ttarang.backend.controller;

import com.solsoll.ttarang.backend.domain.Chat;
import com.solsoll.ttarang.backend.domain.Export;
import com.solsoll.ttarang.backend.domain.User;
import com.solsoll.ttarang.backend.dto.ChatResponseDto;
import com.solsoll.ttarang.backend.dto.ExportResponseDto;
import com.solsoll.ttarang.backend.dto.MarketingChatResponse;
import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import com.solsoll.ttarang.backend.repository.UserRepository;
import com.solsoll.ttarang.backend.service.ChatService;
import com.solsoll.ttarang.backend.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/export")
public class ExportController {

    private final ExportService exportService;
    private final ChatService chatService;

    private final UserRepository userRepository;

    @GetMapping("/list")
    public ResponseEntity<?> getExportList(@AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        List<Export> exports = exportService.getExportsByUserId(userId);
        if(exports == null || exports.isEmpty()) {
            return ResponseEntity.ok(Map.of("export_list", Collections.emptyList()));
        }
        List<Map<String, String>> exportList = (List<Map<String, String>>) exports.stream()
                .map((Function<? super Export, ?>) e -> Map.of(
                        "chat_id", e.getChat().getId().toString(),
                        "title", Optional.ofNullable(e.getTitle()).orElse("(제목 없음)"),
                        "type", e.getType().toString(),
                        "content", trimContent(e.getContent()),
                        "update_date", e.getChat().getCreatedDate()
                )).toList();
        return ResponseEntity.ok(Map.of("export_list", exportList));
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
    }

    private String trimContent(String content) {
        return content.length() > 20 ? content.substring(0, 20) + "..." : content;
    }

    @GetMapping("/{chatid}")
    public ResponseEntity<?> getExport(@AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails, @PathVariable("chatid") Long chatId) {
        try {
            ExportResponseDto response = exportService.getExportByChatId(chatId);
            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            return ResponseEntity.status(e.getErrorCode().getStatus())
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/{chatid}/marketing_chat")
    public ResponseEntity<?> createMarketingChat(@AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails, @PathVariable("chatid") Long chatId){
        System.out.println("Received request for chatId: " + chatId);
        try {
            Long userId = getUserIdFromEmail(userDetails.getUsername());

            MarketingChatResponse response = chatService.createMarketingChat(userId, chatId);

            return ResponseEntity.ok(response);

        } catch (CustomException e) {
            return ResponseEntity.status(e.getErrorCode().getStatus())
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Internal server error"));
        }
    }
}
