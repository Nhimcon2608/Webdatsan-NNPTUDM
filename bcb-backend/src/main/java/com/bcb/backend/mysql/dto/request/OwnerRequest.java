package com.bcb.backend.mysql.dto.request;

import jakarta.validation.constraints.Email;
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
public class OwnerRequest {

    private String id;

    @NotNull(message = "Tên chủ sân không được để trống")
    private String ownerName;

    @NotNull(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải có 10 chữ số")
    private String phoneNumber;

    @NotNull(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

}
