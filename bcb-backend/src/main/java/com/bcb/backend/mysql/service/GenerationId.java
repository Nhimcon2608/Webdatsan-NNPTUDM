package com.bcb.backend.mysql.service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;
import java.time.ZoneId;

public final class GenerationId {

    private static final AtomicInteger counter = new AtomicInteger(0);

    public static synchronized String generateId(String typeOfID) {
        String timestamp = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(DateTimeFormatter.ofPattern("ddMMyyHHmmssSSS"));

        int count = counter.getAndIncrement();
        if (count > 999) {
            counter.set(0);
        }

        return typeOfID + timestamp + String.format("%03d", count);
    }

}
