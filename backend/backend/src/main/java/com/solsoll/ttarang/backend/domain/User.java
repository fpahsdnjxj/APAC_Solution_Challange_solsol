package com.solsoll.ttarang.backend.domain;

import com.solsoll.ttarang.backend.domain.entity.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class User extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password_hash;
    private String email;
    private LocalDate birthday;
    private String phone_number;
}
