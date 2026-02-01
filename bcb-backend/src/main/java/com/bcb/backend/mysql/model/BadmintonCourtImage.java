package com.bcb.backend.mysql.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "badminton_court_image")
public class BadmintonCourtImage {
    
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "image_path")
    private String image_path;

    @Column(name = "short_description")
    private String shortDescription;

    @ManyToOne
    @JoinColumn(name = "badminton_court_id")
    private BadmintonCourt badmintonCourt;
}
