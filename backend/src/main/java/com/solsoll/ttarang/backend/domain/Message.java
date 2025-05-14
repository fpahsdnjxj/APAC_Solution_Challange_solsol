package com.solsoll.ttarang.backend.domain;

import com.solsoll.ttarang.backend.common.Chattype;
import com.solsoll.ttarang.backend.common.Senderrole;
import com.solsoll.ttarang.backend.domain.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Message extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="chat_id", referencedColumnName = "id")
    private Chat chat;

    @Enumerated(EnumType.STRING)
    private Senderrole senderRole=Senderrole.user;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ElementCollection
    @CollectionTable(
            name = "message_links",
            joinColumns = @JoinColumn(name = "message_id") // Message 엔티티의 id를 외래 키로 사용
    )
    @Column(name = "link")
    private List<String> links = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "message_image_urls",
            joinColumns = @JoinColumn(name = "message_id")
    )
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

}
