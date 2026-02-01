package com.bcb.backend.mysql.model;

import java.math.BigDecimal;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment_invoice")
public class PaymentInvoice {
    
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "create_at")
    @CreationTimestamp
    private Date createAt;

    @Column(name = "total")
    private BigDecimal total;

    @Column(name = "payment_status")
    private String paymentStatus;

    @OneToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

}
