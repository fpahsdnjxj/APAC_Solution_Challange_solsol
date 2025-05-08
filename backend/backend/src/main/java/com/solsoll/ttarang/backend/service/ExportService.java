package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.domain.Export;
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
}
