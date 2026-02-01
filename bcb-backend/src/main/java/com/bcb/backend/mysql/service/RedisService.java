package com.bcb.backend.mysql.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.ValueOperations;

@Service
public class RedisService {

    @Autowired
    private ValueOperations<String, String> valueOperations;

    private static final String EMAIL_PREFIX = "email:";
    private static final String PHONE_PREFIX = "phone:";

    public boolean existsPhoneInCache(String phone) {
        System.out.println("Checking cache for phone: " + phone);
        return valueOperations.get(PHONE_PREFIX + phone) != null;
    }

    public boolean existsEmailInCache(String email) {
        System.out.println("Checking cache for phone: " + email);
        return valueOperations.get(EMAIL_PREFIX + email) != null;
    } 
    
    public void addPhoneToCache(String phone) {
        System.out.println("Adding phone: " + phone + " to cache");
        valueOperations.set(PHONE_PREFIX + phone, "exists");
    }

    public void addEmailToCache(String email) {
        System.out.println("Adding email: " + email + " to cache");
        valueOperations.set(EMAIL_PREFIX + email, "exists");

    }

}
