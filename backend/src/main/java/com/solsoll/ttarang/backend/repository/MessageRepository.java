package com.solsoll.ttarang.backend.repository;

import com.solsoll.ttarang.backend.domain.Message;
import com.solsoll.ttarang.backend.domain.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChat(Chat chat);
}
