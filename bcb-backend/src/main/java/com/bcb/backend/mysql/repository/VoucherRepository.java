package com.bcb.backend.mysql.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.bcb.backend.mysql.model.Voucher;

public interface VoucherRepository extends JpaRepository<Voucher, String> {
    List<Voucher> findByIsAvailableTrue();

}
