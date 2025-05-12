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
public class AIMarketingRequestDto {
    private String content;
    @JsonProperty("image_urls")
    private List<String> imageUrls;
    private List<String> links;
}
