package com.example.distributedapiratelimiter.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactAppController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        String originalUri = (String) request.getAttribute("jakarta.servlet.error.request_uri");
        if (originalUri != null && originalUri.startsWith("/api/")) {
            // For API endpoints, we should not return index.html
            // Return null to let the default error handler format it as JSON (or handle it otherwise)
            return null;
        }
        // For all other unhandled paths (e.g. React router paths), forward to the frontend
        return "forward:/index.html";
    }
}
