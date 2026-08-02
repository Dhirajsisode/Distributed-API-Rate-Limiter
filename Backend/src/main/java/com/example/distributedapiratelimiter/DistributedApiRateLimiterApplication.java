package com.example.distributedapiratelimiter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DistributedApiRateLimiterApplication {

    public static void main(String[] args) {
        java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("UTC"));
        SpringApplication.run(DistributedApiRateLimiterApplication.class, args);
    }

}
