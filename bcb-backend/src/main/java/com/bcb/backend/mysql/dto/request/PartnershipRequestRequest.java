package com.bcb.backend.mysql.dto.request;

import java.util.Date;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnershipRequestRequest {
    
    private String id;
    private Date createAt;

    @NotNull(message = "Tên chi nhánh không được để trống")
    private String branchName;

    @NotNull(message = "Địa chỉ không được để trống")
    private String address;

    @NotNull(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải có 10 chữ số")
    private String phoneNumber;

    private String status;
    
}
