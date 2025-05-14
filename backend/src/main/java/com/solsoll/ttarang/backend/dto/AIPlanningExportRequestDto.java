package com.solsoll.ttarang.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class AIPlanningExportRequestDto {
    @JsonProperty("is_completed")
    private boolean isCompleted;
    @JsonProperty("default_info")
    private PlanningChatRequest defaultInfo;
    @JsonProperty("previous_message_list")
    private List<SimpleMessageDto> previousMessageList;
}
