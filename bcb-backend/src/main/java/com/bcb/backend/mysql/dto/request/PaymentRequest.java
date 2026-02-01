package com.bcb.backend.mysql.dto.request;

import java.util.List;

import org.springframework.data.repository.NoRepositoryBean;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@NoRepositoryBean
@Builder
public class PaymentRequest {
    private String amount;
    private List<String> resIds;
    private String orderInfo;
}
