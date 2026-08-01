package com.example.distributedapiratelimiter.model;

public class UserRequestInfo {

    private int requestCount;
    private long windowStartTime;

    public UserRequestInfo(int requestCount, long windowStartTime) {
        this.requestCount = requestCount;
        this.windowStartTime = windowStartTime;
    }

    public int getRequestCount() {
        return requestCount;
    }

    public void setRequestCount(int requestCount) {
        this.requestCount = requestCount;
    }

    public long getWindowStartTime() {
        return windowStartTime;
    }

    public void setWindowStartTime(long windowStartTime) {
        this.windowStartTime = windowStartTime;
    }
}