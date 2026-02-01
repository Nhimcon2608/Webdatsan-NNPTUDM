package com.bcb.backend.mysql.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bcb.backend.mysql.model.PaymentInvoice;
import java.util.List;

public interface PaymentInvoiceRepository extends JpaRepository<PaymentInvoice, String> {
	List<PaymentInvoice> findAllByReservation_ReservationDetails_BadmintonCourt_Branch_Id(String branchId);

	List<PaymentInvoice> findByReservation_IdIn(List<String> reservationIds);

	boolean existsByReservation_Id(String reservationId);
}
