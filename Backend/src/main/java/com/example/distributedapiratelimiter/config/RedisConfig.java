package com.example.distributedapiratelimiter.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
public class RedisConfig {

    private static final Logger logger = LoggerFactory.getLogger(RedisConfig.class);

    @Bean
    public StringRedisTemplate redisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }

    @Bean
    public ApplicationRunner verifyRedisConnection(StringRedisTemplate redisTemplate) {
        return args -> {
            try {
                logger.info("Verifying Redis connection...");
                // Attempt a simple read operation to verify connectivity
                redisTemplate.opsForValue().get("startup-verification");
                logger.info("Successfully connected to Redis. Rate Limiter datastore is ready.");
            } catch (Exception e) {
                logger.error("FATAL ERROR: Failed to connect to Redis. The application cannot start without Redis.", e);
                throw new IllegalStateException("Failed to connect to Redis during startup. Redis is required for Rate Limiting.", e);
            }
        };
    }
}
