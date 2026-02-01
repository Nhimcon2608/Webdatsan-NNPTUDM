package com.bcb.backend.mysql.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "owner")
public class Owner {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @OneToMany(mappedBy = "owner")
    @Builder.Default
    private List<PartnershipRequest> partnershipRequests = new ArrayList<>();
}
