package com.bcb.backend.mysql.model;

import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
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
@Table(name = "reservation_detail")
public class ReservationDetail {
    
    @EmbeddedId
    private ReservationDetailId id;

    @MapsId("badmintonCourtId")
    @ManyToOne
    @JoinColumn(name = "badminton_court_id")
    private BadmintonCourt badmintonCourt;

    @MapsId("reservationId")
    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "rental_time")
    private double rentalTime;
    
}
