package com.solsoll.ttarang.backend.repository;

import com.solsoll.ttarang.backend.domain.ProjectForm;
import com.solsoll.ttarang.backend.domain.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectFormRepository extends JpaRepository<ProjectForm, Long> {
    Optional<ProjectForm> findByChat(Chat chat);
}