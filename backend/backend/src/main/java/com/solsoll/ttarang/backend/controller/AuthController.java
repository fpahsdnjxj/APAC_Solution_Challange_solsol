package com.solsoll.ttarang.backend.controller;

import com.solsoll.ttarang.backend.dto.TokenResponseDto;
import com.solsoll.ttarang.backend.dto.UserLoginRequestDto;
import com.solsoll.ttarang.backend.dto.UserSignUpRequestDto;
import com.solsoll.ttarang.backend.security.JwtTokenProvider;
import com.solsoll.ttarang.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<TokenResponseDto>  signup(@RequestBody @Valid UserSignUpRequestDto dto) {
        TokenResponseDto response=userService.signup(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody @Valid UserLoginRequestDto dto) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.login(dto));
    }

}
