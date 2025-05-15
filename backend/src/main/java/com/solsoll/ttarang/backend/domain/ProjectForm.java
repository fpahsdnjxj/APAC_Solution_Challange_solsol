package com.solsoll.ttarang.backend.domain;

import com.solsoll.ttarang.backend.domain.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class ProjectForm extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="chat_id", referencedColumnName = "id", nullable = false)
    private Chat chat;

    private String title = "";
    private String location = "";
    @Column(columnDefinition = "TEXT")
    private String detail_info = "";

    @ElementCollection
    @CollectionTable(
            name = "project_form_photo_urls",
            joinColumns = @JoinColumn(name = "project_form_id", referencedColumnName = "id")
    )
    @Column(name = "photo_url")
    private List<String> photo_urls = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "project_form_keywords",
            joinColumns = @JoinColumn(name = "project_form_id", referencedColumnName = "id")
    )
    @Column(name = "keywords")
    private List<String> keywords = new ArrayList<>();

    private String available_dates = "";
    private String duration = "";
    private double price ;
    @Column(columnDefinition = "TEXT")
    private String policy = "";
}
