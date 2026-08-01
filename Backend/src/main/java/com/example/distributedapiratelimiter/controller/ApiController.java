package com.example.distributedapiratelimiter.controller;

import com.example.distributedapiratelimiter.model.ApiResponse;
import com.example.distributedapiratelimiter.service.RateLimiterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    private final RateLimiterService rateLimiterService;

    public ApiController(RateLimiterService rateLimiterService) {
        this.rateLimiterService = rateLimiterService;
    }

    @GetMapping("/api/data")
    public ResponseEntity<ApiResponse> getData() {

        String userId = "user1";

        if (rateLimiterService.allowRequest(userId)) {

            ApiResponse response = new ApiResponse(
                    200,
                    "Request Allowed"
            );

            return ResponseEntity.ok(response);
        }

        ApiResponse response = new ApiResponse(
                429,
                "Too Many Requests"
        );

        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body(response);
    }
}