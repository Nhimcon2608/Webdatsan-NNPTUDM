package com.bcb.backend.mysql.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlacklistedTokenInfo {
    private String token;
    private long ttlMillis;
    private String formattedTTL;

    public BlacklistedTokenInfo(String token, long ttlMillis) {
        this.token = token;
        this.ttlMillis = ttlMillis;
        this.formattedTTL = formatTTL(ttlMillis);
    }

    private String formatTTL(long ttlMillis) {
        if (ttlMillis == -1)
            return "Vĩnh viễn";
        if (ttlMillis == -2)
            return "Không tồn tại";

        long seconds = ttlMillis / 1000;
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long remainingSeconds = seconds % 60;
        long days = hours / 24;
        hours = hours % 24;

        StringBuilder formattedTime = new StringBuilder();

        if (days > 0) {
            formattedTime.append(days).append(" ngày ");
        }
        if (hours > 0) {
            formattedTime.append(hours).append(" giờ ");
        }
        if (minutes > 0 || hours > 0) {
            formattedTime.append(minutes).append(" phút ");
        }
        if (remainingSeconds > 0 && hours == 0) {
            formattedTime.append(remainingSeconds).append(" giây");
        }

        return formattedTime.toString().trim();
    }
}
