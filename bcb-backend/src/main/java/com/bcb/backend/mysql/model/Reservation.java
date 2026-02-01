package com.bcb.backend.mysql.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
@Table(name = "reservation")
public class Reservation {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "create_at")
    @CreationTimestamp
    private Date createAt;

    @Column(name = "book_at")
    private Date bookAt;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "deposit")
    private BigDecimal deposit;

    @Column(name = "status")
    private String status;
    /*
     * đang đợi thanh toán: awaiting_payment
     * đang chờ checkin: waiting
     * đã checkin: checked
     * đã hoàn thành: finish
     * đã hủy: cancel
     */

    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @OneToOne(mappedBy = "reservation")
    private PaymentInvoice paymentInvoice;

    @OneToMany(mappedBy = "reservation")
    @Builder.Default
    private List<ReservationDetail> reservationDetails = new ArrayList<>();

    @OneToMany(mappedBy = "reservation")
    @Builder.Default
    private List<TemporaryRecruitment> temporaryRecruitments = new ArrayList<>();
}
