package com.bcb.backend.mysql.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bcb.backend.mysql.model.Reservation;

import java.util.Date;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, String> {

	// Các phương thức hiện tại
	List<Reservation> findByStatusNot(String status);

	List<Reservation> findTop5ByBranchIdOrderByCreateAtDesc(String branchId);

	List<Reservation> findTop5ByBranchIdAndStatusOrderByCreateAtDesc(String branchId, String status);

	List<Reservation> findByBranch_Id(String branchId);

	List<Reservation> findByBranch_IdAndStatus(String branchId, String status);

	// --- Thêm phương thức mới ---
	// Lấy tất cả Reservation theo bookAt giảm dần
	List<Reservation> findAllByOrderByBookAtDesc();

	// Lấy tất cả Reservation theo branchId, sắp xếp theo bookAt giảm dần
	List<Reservation> findByBranch_IdOrderByBookAtDesc(String branchId);

	List<Reservation> findByIdIn(List<String> ids);

	List<Reservation> findByBookAtBetweenAndStatusNotAndBranch_Id(
			Date from,
			Date to,
			String status,
			String branchId);

	List<Reservation> findByBranch_IdAndBookAtGreaterThanEqualAndBookAtLessThanAndStatusNot(
			String branchId,
			Date startOfDay,
			Date endOfDay,
			String status);

}
