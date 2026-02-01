package com.bcb.backend.mysql.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "badminton_court")
public class BadmintonCourt {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "ordinal_number")
    private short ordinalNumber;

    @Column(name = "is_available")
    private boolean isAvailable;
    /*
     * có thể thuê: true
     * không thể thuê: false
     */

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @OneToMany(mappedBy = "badmintonCourt")
    @Builder.Default
    private List<ReservationDetail> reservationDetails = new ArrayList<>();

    @OneToMany(mappedBy = "badmintonCourt")
    @Builder.Default
    private List<BadmintonCourtImage> badmintonCourtImages = new ArrayList<>();
}
