package com.bcb.backend.mysql.model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "player")
public class Player {
    
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "full_name")
    private String fullName;
    
    @Column(name = "date_of_birth")
    private Date dob;

    @Column(name = "gender")
    private Boolean gender;
    /*
     * nam: true
     * nữ: false
     */

    @Column(name = "email")
    private String email;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToMany(mappedBy = "player")
    @Builder.Default
    private List<TemporaryRegistration> temporaryRegistrations = new ArrayList<>();

    @OneToMany(mappedBy = "player")
    @Builder.Default
    private List<TemporaryRegistration> temporaryRecruitmentSaved = new ArrayList<>();

    @OneToMany(mappedBy = "player")
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();
}
