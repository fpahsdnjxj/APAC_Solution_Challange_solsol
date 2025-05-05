package com.solsoll.ttarang.backend.domain;

import com.solsoll.ttarang.backend.common.Chattype;
import com.solsoll.ttarang.backend.domain.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Export extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Chattype type;

    @ManyToOne
    @JoinColumn(name="chat_id", referencedColumnName = "id")
    private Chat chat;

    private String content;

    @ElementCollection
    @CollectionTable(name="export_image_urls")
    @Column(name="image_urls")
    private List<String> image_urls;
}
