package com.example.distributedapiratelimiter.service;

import com.example.distributedapiratelimiter.model.UserRequestInfo;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RateLimiterService {

    private final Map<String, UserRequestInfo> requestMap = new HashMap<>();

    private static final int LIMIT = 5;
    private static final long WINDOW_SIZE = 60 * 1000;

    public boolean allowRequest(String userId) {

        long currentTime = System.currentTimeMillis();

        UserRequestInfo userInfo = requestMap.get(userId);

        // First request
        if (userInfo == null) {
            userInfo = new UserRequestInfo(1, currentTime);
            requestMap.put(userId, userInfo);

            System.out.println("NEW USER -> Count = 1");
            return true;
        }

        // Reset after 60 seconds
        if (currentTime - userInfo.getWindowStartTime() >= WINDOW_SIZE) {
            userInfo.setRequestCount(1);
            userInfo.setWindowStartTime(currentTime);

            System.out.println("WINDOW RESET -> Count = 1");
            return true;
        }

        // Limit reached
        if (userInfo.getRequestCount() >= LIMIT) {
            System.out.println("BLOCKED -> Count = " + userInfo.getRequestCount());
            return false;
        }

        // Increase count
        userInfo.setRequestCount(userInfo.getRequestCount() + 1);

        System.out.println("ALLOWED -> Count = " + userInfo.getRequestCount());

        return true;
    }
}