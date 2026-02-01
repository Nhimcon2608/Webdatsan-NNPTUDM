package com.bcb.backend.mysql.service;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.bcb.backend.mysql.dto.request.PaymentRequest;
import com.bcb.backend.mysql.model.PaymentSession;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MomoService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${MOMO_PARTNER_CODE}")
    private String partnerCode;

    @Value("${MOMO_ACCESS_KEY}")
    private String accessKey;

    @Value("${MOMO_SECRET_KEY}")
    private String secretKey;

    @Value("${MOMO_REDIRECT_URL}")
    private String redirectUrl;

    @Value("${MOMO_IPN_URL}")
    private String ipnUrl;

    @Value("${MOMO_ENDPOINT}")
    private String endpoint;

    public Map<String, Object> createPayment(PaymentRequest req) {

        List<String> reservationIds = req.getResIds();

        String paymentSessionId = "PAY_" + UUID.randomUUID();
        String requestId = UUID.randomUUID().toString();
        String extraData = "";

        PaymentSession session = new PaymentSession(
                paymentSessionId,
                reservationIds,
                req.getAmount(),
                "PENDING",
                System.currentTimeMillis());

        redisTemplate.opsForValue().set(
                "payment:" + paymentSessionId,
                session,
                15,
                TimeUnit.MINUTES);

        Map<String, Object> body = new HashMap<>();
        body.put("partnerCode", partnerCode);
        body.put("accessKey", accessKey);
        body.put("requestId", requestId);
        body.put("amount", req.getAmount());
        body.put("orderId", paymentSessionId);
        body.put("orderInfo", req.getOrderInfo());
        body.put("redirectUrl", redirectUrl);
        body.put("ipnUrl", ipnUrl);
        body.put("extraData", extraData);
        body.put("requestType", "captureWallet");

        String rawHash = "accessKey=" + accessKey +
                "&amount=" + req.getAmount() +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + paymentSessionId +
                "&orderInfo=" + req.getOrderInfo() +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=captureWallet";

        body.put("signature", hmacSHA256(rawHash));

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                endpoint,
                HttpMethod.POST,
                new HttpEntity<>(body),
                new ParameterizedTypeReference<>() {
                });

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("MoMo API call failed");
        }

        Map<String, Object> result = response.getBody();
        if (result == null) {
            throw new RuntimeException("MoMo response body is null");
        }

        result.put("orderId", paymentSessionId);
        return result;
    }

    public boolean verifyIpnSignature(Map<String, Object> payload) {

        String rawData = "accessKey=" + accessKey +
                "&amount=" + get(payload, "amount") +
                "&extraData=" + get(payload,"extraData") +
                "&message=" + get(payload, "message") +
                "&orderId=" + get(payload, "orderId") +
                "&orderInfo=" + get(payload, "orderInfo") +
                "&orderType=" + get(payload, "orderType") +
                "&partnerCode=" + get(payload, "partnerCode") +
                "&payType=" + get(payload, "payType") +
                "&requestId=" + get(payload, "requestId") +
                "&responseTime=" + get(payload, "responseTime") +
                "&resultCode=" + get(payload, "resultCode") +
                "&transId=" + get(payload, "transId");

        String expectedSignature = hmacSHA256(rawData);
        String receivedSignature = get(payload, "signature");

        return expectedSignature.equals(receivedSignature);
    }

    private String hmacSHA256(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            return HexFormat.of().formatHex(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String get(Map<String, Object> map, String key) {
        return map.get(key) == null ? "" : map.get(key).toString();
    }
}
