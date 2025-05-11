package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.domain.Export;
import com.solsoll.ttarang.backend.dto.ExportResponseDto;
import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import com.solsoll.ttarang.backend.repository.ExportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final ExportRepository exportRepository;

    public List<Export> getExportsByUserId(Long userId) {
        return exportRepository.findByChat_User_Id(userId);
    }

    public ExportResponseDto getExportByChatId(Long chatId) {
        Export export = exportRepository.findByChatId(chatId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Export not found for chat id " + chatId));

        return new ExportResponseDto(
                export.getType().toString().toLowerCase(),
                export.getContent(),
                export.getImageUrls(),
                export.getLinks(),
                export.getCreatedDate()
        );
    }
}
