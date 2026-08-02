package com.example.distributedapiratelimiter.controller;

import com.example.distributedapiratelimiter.model.ApiResponse;
import com.example.distributedapiratelimiter.service.RateLimiterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    public ApiController() {
    }

    @GetMapping("/api/data")
    public ResponseEntity<ApiResponse> getData() {
        // Rate limiting is already handled globally by RateLimiterFilter
        ApiResponse response = new ApiResponse(
                200,
                "Request Allowed"
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/health")
    public ResponseEntity<ApiResponse> getHealth() {
        return ResponseEntity.ok(new ApiResponse(200, "UP"));
    }
}