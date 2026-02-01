package com.bcb.backend.mysql.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ReservationDetailId implements Serializable {

    @Column(name = "badminton_court_id")
    private String badmintonCourtId;

    @Column(name = "reservation_id")
    private String reservationId;
}
