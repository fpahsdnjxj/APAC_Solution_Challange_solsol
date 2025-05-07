package com.solsoll.ttarang.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.solsoll.ttarang.backend.domain.User;
import com.solsoll.ttarang.backend.dto.*;
import com.solsoll.ttarang.backend.repository.UserRepository;
import com.solsoll.ttarang.backend.security.JwtTokenProvider;
import com.solsoll.ttarang.backend.exception.CustomException;
import com.solsoll.ttarang.backend.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public TokenResponseDto signup(UserSignUpRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setUsername(requestDto.getUserName());
        user.setEmail(requestDto.getEmail());
        user.setPassword_hash(passwordEncoder.encode(requestDto.getPassword()));
        user.setPhone_number(requestDto.getPhoneNumber());
        user.setBirthday(requestDto.getBirthDate());

        userRepository.save(user);

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail());
        return new TokenResponseDto(token, user.getUsername());
    }

    public TokenResponseDto login(UserLoginRequestDto requestDto) {
        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGIN_FAILED));

        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword_hash())) {
            throw new CustomException(ErrorCode.LOGIN_FAILED);
        }

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail());

        return new TokenResponseDto(token, user.getUsername());
    }

    private GoogleIdToken.Payload verifyGoogleIdToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                    .setAudience(Collections.singletonList("YOUR_GOOGLE_CLIENT_ID"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new CustomException(ErrorCode.INVALID_TOKEN);
            }

            return idToken.getPayload();
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }
    }

    public TokenResponseDto googleLogin(GoogleLoginRequestDto dto) {
        GoogleIdToken.Payload payload = verifyGoogleIdToken(dto.getIdToken()); // 직접 검증해야 함
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(name);
                    newUser.setPassword_hash("");
                    return userRepository.save(newUser);
                });

        String token = jwtTokenProvider.createToken(user.getId(), email);
        return new TokenResponseDto(token, user.getUsername());
    }
}