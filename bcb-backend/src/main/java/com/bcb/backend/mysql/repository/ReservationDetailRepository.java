package com.bcb.backend.mysql.repository;

import com.bcb.backend.mysql.model.ReservationDetail;
import com.bcb.backend.mysql.model.ReservationDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Date;
import java.util.List;

public interface ReservationDetailRepository extends JpaRepository<ReservationDetail, ReservationDetailId> {
    List<ReservationDetail> findByReservationId(String reservationId);

    @Query("SELECT rd FROM ReservationDetail rd " +
            "WHERE rd.badmintonCourt.id = :courtId " +
            "AND rd.reservation.bookAt BETWEEN :startOfDay AND :endOfDay")
    List<ReservationDetail> findByCourtIdAndBookAtBetween(
            @Param("courtId") String courtId,
            @Param("startOfDay") Date startOfDay,
            @Param("endOfDay") Date endOfDay);

}
