package com.example.distributedapiratelimiter.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimiterService {

    private final StringRedisTemplate redisTemplate;

    private static final int LIMIT = 5;
    private static final long WINDOW_SIZE_SECONDS = 60;

    public RateLimiterService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean allowRequest(String userId) {
        String key = "rate_limit:" + userId;
        
        Long currentCount = redisTemplate.opsForValue().increment(key);
        
        if (currentCount != null && currentCount == 1) {
            // First request in the window, set expiry
            redisTemplate.expire(key, Duration.ofSeconds(WINDOW_SIZE_SECONDS));
            System.out.println("NEW USER / WINDOW RESET -> Count = 1 for IP: " + userId);
            return true;
        }
        
        if (currentCount != null && currentCount > LIMIT) {
            System.out.println("BLOCKED -> Count = " + currentCount + " for IP: " + userId);
            return false;
        }

        System.out.println("ALLOWED -> Count = " + currentCount + " for IP: " + userId);
        return true;
    }
}