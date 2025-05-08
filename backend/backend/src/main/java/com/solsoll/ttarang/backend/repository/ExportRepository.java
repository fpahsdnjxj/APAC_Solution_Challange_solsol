package com.solsoll.ttarang.backend.repository;

import com.solsoll.ttarang.backend.domain.Export;
import com.solsoll.ttarang.backend.domain.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExportRepository extends JpaRepository<Export, Long> {
    List<Export> findByChat(Chat chat);
    List<Export> findByChat_User_Id(Long userId);
}