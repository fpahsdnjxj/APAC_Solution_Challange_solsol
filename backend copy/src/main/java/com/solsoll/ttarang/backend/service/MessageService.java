package com.solsoll.ttarang.backend.service;

import com.solsoll.ttarang.backend.domain.Chat;
import com.solsoll.ttarang.backend.domain.Message;
import com.solsoll.ttarang.backend.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    public List<Message> findMessagesByChat(Chat chat) {
        return messageRepository.findByChat(chat);
    }
}
