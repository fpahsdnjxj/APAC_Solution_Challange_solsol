package com.solsoll.ttarang.backend.domain;

import com.solsoll.ttarang.backend.common.Chattype;
import com.solsoll.ttarang.backend.common.Senderrole;
import com.solsoll.ttarang.backend.domain.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    private Senderrole sender_role;

    private String content;

    @ElementCollection
    @CollectionTable(name="message_links")
    @Column(name="links")
    private List<String> links;

    @ElementCollection
    @CollectionTable(name="message_image_urls")
    @Column(name="image_urls")
    private List<String> image_urls;

}
