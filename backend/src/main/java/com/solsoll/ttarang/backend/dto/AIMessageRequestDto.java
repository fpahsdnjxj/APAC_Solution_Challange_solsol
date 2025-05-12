package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIMessageRequestDto {
    @JsonProperty("is_completed")
    private boolean isCompleted;
    @JsonProperty("previous_message_list")
    private List<SimpleMessageDto> previousMessageList;
    @JsonProperty("current_message")
    private SimpleMessageDto currentMessage;
}
