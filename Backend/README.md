# Distributed API Rate Limiter

## Overview

This project is a **Distributed API Rate Limiter** developed using **Java** and **Spring Boot**. It limits the number of API requests from a client within a fixed time window. If the request limit is exceeded, the API returns **HTTP 429 (Too Many Requests)**.

---

## Features

- Fixed Window Rate Limiting Algorithm
- REST API using Spring Boot
- HTTP Status 200 (Request Allowed)
- HTTP Status 429 (Too Many Requests)
- Docker Support
- Redis Configuration
- JSON Response

---

## Technology Stack

- Java 21
- Spring Boot
- Maven
- Docker
- Redis
- IntelliJ IDEA

---

## Project Structure

```
src
├── controller
├── service
├── model
├── filter
├── config
└── exception
```

---

## API Endpoint

```
GET /api/data
```

---

## Success Response

```json
{
  "status": 200,
  "message": "Request Allowed"
}
```

---

## Rate Limit Exceeded

```json
{
  "status": 429,
  "message": "Too Many Requests"
}
```

---

## How to Run

1. Clone the repository

```bash
git clone https://github.com/Dhirajsisode/Distributed-API-Rate-Limiter.git
```

2. Open the project in IntelliJ IDEA.

3. Run the Spring Boot application.

4. Test the API using:

```
GET http://localhost:8080/api/data
```

---

## Future Enhancements

- Sliding Window Algorithm
- Token Bucket Algorithm
- User Authentication
- API Gateway Integration
- Monitoring with Prometheus & Grafana

---

## Author

**Dhiraj Sisode**

MCA Project
