package com.solsoll.ttarang.backend.domain;

import com.solsoll.ttarang.backend.common.Chattype;
import com.solsoll.ttarang.backend.domain.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "export")
@Getter
@Setter
public class Export extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Chattype type;

    private String title;

    @ManyToOne
    @JoinColumn(name = "chat_id", referencedColumnName = "id")
    private Chat chat;

    private String content;

    @ElementCollection
    @CollectionTable(
            name = "export_image_urls",
            joinColumns = @JoinColumn(name = "export_id") // FK 명시
    )
    @Column(name = "image_url") // 단수로 명명하는 게 일반적
    private List<String> imageUrls=new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "export_links",
            joinColumns = @JoinColumn(name = "export_id") // FK 명시
    )
    @Column(name = "links") // 단수로 명명하는 게 일반적
    private List<String> links=new ArrayList<>();
}
