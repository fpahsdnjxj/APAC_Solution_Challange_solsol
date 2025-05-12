package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UserSignUpRequestDto {
    @NotBlank
    @JsonProperty("user_name")
    private String userName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String phoneNumber;
    private LocalDate birthDate;
}