package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class GoogleLoginRequestDto {
    @JsonProperty("id_token")
    private String idToken;
}
