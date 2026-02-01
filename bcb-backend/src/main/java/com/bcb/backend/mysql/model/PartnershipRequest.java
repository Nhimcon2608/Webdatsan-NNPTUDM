package com.bcb.backend.mysql.model;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "partnership_request")
public class PartnershipRequest {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "create_at")
    @CreationTimestamp
    private Date createAt;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "status")
    private String status;
    /*
     * đã gửi yêu cầu: sent
     * chờ duyệt: pending
     * đã duyệt: approved
     * từ chối: refused
     */

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @OneToOne(mappedBy = "partnershipRequest")
    private Branch branch;
}
