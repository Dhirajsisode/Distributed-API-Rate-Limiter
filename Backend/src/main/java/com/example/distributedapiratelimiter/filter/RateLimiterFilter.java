package com.example.distributedapiratelimiter.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.distributedapiratelimiter.service.RateLimiterService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimiterFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;

    public RateLimiterFilter(RateLimiterService rateLimiterService) {
        this.rateLimiterService = rateLimiterService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        System.out.println("Incoming Request : " + path);

        if (!"/api/data".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String userId = request.getRemoteAddr();

        System.out.println("User IP : " + userId);

        boolean allowed = rateLimiterService.allowRequest(userId);

        System.out.println("Allowed : " + allowed);

        if (!allowed) {
            response.setStatus(429);
            response.setContentType("application/json");

            response.getWriter().write("{\n"
                    + "  \"status\":429,\n"
                    + "  \"message\":\"Too Many Requests\"\n"
                    + "}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}