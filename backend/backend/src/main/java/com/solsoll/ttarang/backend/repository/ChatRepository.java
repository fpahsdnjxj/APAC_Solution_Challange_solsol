package com.solsoll.ttarang.backend.repository;

import com.solsoll.ttarang.backend.domain.Chat;
import com.solsoll.ttarang.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByUser(User user);
}