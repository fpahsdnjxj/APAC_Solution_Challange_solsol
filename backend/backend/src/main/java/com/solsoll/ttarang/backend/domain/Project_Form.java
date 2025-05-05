package com.solsoll.ttarang.backend.domain;


import com.solsoll.ttarang.backend.domain.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@Entity
public class Project_Form extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="chat_id", referencedColumnName = "id")
    private Chat chat;

    private String title;
    private String location;
    private String detail_info;

    @ElementCollection
    @CollectionTable(name="project_form_photo_urls")
    @Column(name="photo_url")
    private List<String> photo_urls;

    @ElementCollection
    @CollectionTable(name="project_form_keywords")
    @Column(name="keywords")
    private List<String> keywords;
    private String available_dates;
    private String duration;
    private double price;
    private String policy;
}
