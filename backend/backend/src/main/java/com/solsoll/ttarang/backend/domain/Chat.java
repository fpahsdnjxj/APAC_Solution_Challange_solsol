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
public class Chat extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @Enumerated(EnumType.STRING)
    private Chattype type;

    @ElementCollection
    @CollectionTable(name="project_form_keywords")
    @Column(name="keywords")
    private List<String> keywords;

}
