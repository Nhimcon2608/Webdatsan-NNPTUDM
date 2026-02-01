package com.bcb.backend.mysql.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bcb.backend.mysql.dto.request.PaymentRequest;
import com.bcb.backend.mysql.model.PaymentSession;
import com.bcb.backend.mysql.service.FixedBookingService;
import com.bcb.backend.mysql.service.MomoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payment/momo")
@RequiredArgsConstructor
public class MoMoController {

    private final MomoService momoService;
    private final FixedBookingService fixedBookingService;
    private final RedisTemplate<String, Object> redisTemplate;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest paymentRequest) {
        return ResponseEntity.ok(momoService.createPayment(paymentRequest));
    }

    @PostMapping("/ipn")
    public ResponseEntity<String> ipn(@RequestBody Map<String, Object> payload) {
        System.out.println(payload);

        if (!momoService.verifyIpnSignature(payload)) {
            return ResponseEntity.ok("IGNORED");
        }

        String orderId = payload.get("orderId").toString();
        int resultCode = Integer.parseInt(payload.get("resultCode").toString());
        PaymentSession session = (PaymentSession) redisTemplate.opsForValue()
                .get("payment:" + orderId);

        if (session == null) {
            return ResponseEntity.ok("IGNORED");
        }
        System.out.println(session.getReservationIds());

        if (resultCode == 0) {
            fixedBookingService.changeStatus(session.getReservationIds(), "waiting");
        } else {
            fixedBookingService.changeStatus(session.getReservationIds(), "cancel");
        }

        return ResponseEntity.ok("OK");
    }

    @GetMapping("/resIds-of/{orderId}")
    public ResponseEntity<List<String>> getResIdsByOrderId(@PathVariable String orderId) {
        PaymentSession session = (PaymentSession) redisTemplate.opsForValue()
                .get("payment:" + orderId);

        if (session == null) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.ok(session.getReservationIds());
        }
    }
}
