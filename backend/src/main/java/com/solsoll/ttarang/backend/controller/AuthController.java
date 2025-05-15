package com.solsoll.ttarang.backend.controller;

import com.solsoll.ttarang.backend.dto.TokenResponseDto;
import com.solsoll.ttarang.backend.dto.UserLoginRequestDto;
import com.solsoll.ttarang.backend.dto.UserSignUpRequestDto;
import com.solsoll.ttarang.backend.security.JwtTokenProvider;
import com.solsoll.ttarang.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
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

    @GetMapping("/google")
    public void redirectToGoogle(HttpServletResponse response) throws IOException {
        String redirectUri = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=28631947634-arttk6ml7ov6rl981dg4f8ocmdagii1d.apps.googleusercontent.com" +
                "&redirect_uri=http://ttarang.com/auth/google/callback" +
                "&response_type=code" +
                "&scope=openid%20email%20profile";

        response.sendRedirect(redirectUri);
    }

    @GetMapping("/google/callback")
    public void handleGoogleCallback(@RequestParam("code") String code, HttpServletResponse response) throws IOException  {
        TokenResponseDto token = userService.handleGoogleLogin(code);

        String frontendRedirectUrl = "http://ttarang.com/oauth-success" +
                "?accessToken=" + URLEncoder.encode(token.getAccessToken(), StandardCharsets.UTF_8);

        response.sendRedirect(frontendRedirectUrl);
    }
    @GetMapping("/google")
    public void redirectToGoogle(HttpServletResponse response) throws IOException {
        String redirectUri = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=28631947634-arttk6ml7ov6rl981dg4f8ocmdagii1d.apps.googleusercontent.com" +
                "&redirect_uri=https://ttarang.com/api/auth/google/callback" +
                "&response_type=code" +
                "&scope=openid%20email%20profile";

        response.sendRedirect(redirectUri);
    }

    @GetMapping("/google/callback")
    public void handleGoogleCallback(@RequestParam("code") String code, HttpServletResponse response) throws IOException  {
        TokenResponseDto token = userService.handleGoogleLogin(code);

        String frontendRedirectUrl = "https://ttarang.com/oauth-success" +
                "?accessToken=" + URLEncoder.encode(token.getAccessToken(), StandardCharsets.UTF_8);

        response.sendRedirect(frontendRedirectUrl);
    }
}
