package com.bcb.backend.mysql.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    @NotNull(message = "Mật khẩu hiện tại không được để trống")
    private String oldPassword;

    @NotNull(message = "Mật khẩu mới không được để trống")
    private String newPassword;
    
}
