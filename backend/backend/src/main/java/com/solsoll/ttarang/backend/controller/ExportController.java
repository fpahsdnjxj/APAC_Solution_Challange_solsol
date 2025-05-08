package com.solsoll.ttarang.backend.controller;

import com.solsoll.ttarang.backend.domain.Chat;
import com.solsoll.ttarang.backend.domain.Export;
import com.solsoll.ttarang.backend.domain.User;
import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import com.solsoll.ttarang.backend.repository.UserRepository;
import com.solsoll.ttarang.backend.service.ChatService;
import com.solsoll.ttarang.backend.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/export")
public class ExportController {

    private final ExportService exportService;

    private final UserRepository userRepository;

    @GetMapping("/list")
    public ResponseEntity<?> getExportList(@AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        List<Export> exports = exportService.getExportsByUserId(userId);
        // title, type, content 일부만 리턴
        List<Map<String, String>> exportList = exports.stream()
                .map(e -> Map.of(
                        "title", e.getTitle(),
                        "type", e.getType().toString(),
                        "content", trimContent(e.getContent())
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
}