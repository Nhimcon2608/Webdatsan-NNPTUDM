package com.bcb.backend.mysql.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "account")
public class Account {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "user_name")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;
    /*
     * admin: ADMIN
     * Quản lý: MANAGER
     * Lông thủ: USER
     */

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "is_activated")
    private boolean isActivated;

    @OneToOne(mappedBy = "account")
    private Branch branch;

    @OneToOne(mappedBy = "account")
    private Player player;
}
