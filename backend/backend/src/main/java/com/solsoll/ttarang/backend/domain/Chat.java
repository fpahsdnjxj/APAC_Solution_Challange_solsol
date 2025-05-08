package com.solsoll.ttarang.backend.domain;

import com.solsoll.ttarang.backend.common.Chattype;
import com.solsoll.ttarang.backend.domain.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="chats")
@Setter
@Getter
public class Chat extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @Enumerated(EnumType.STRING)
    private Chattype type;

    @ElementCollection
    @CollectionTable(
            name = "chat_keywords",
            joinColumns = @JoinColumn(name = "chat_id") // Chat 엔티티의 id를 외래 키로 사용
    )
    @Column(name = "keywords")
    private List<String> keywords;

    @Column(name = "is_completed")
    private boolean completed = false;
}
