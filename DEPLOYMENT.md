# Deployment Guide

This project is configured to be deployed as a single, fully-contained Docker application on [Render](https://render.com). 
Both the React Frontend and the Spring Boot Backend are bundled together and served by the Spring Boot server. 
A separate Redis service is provisioned alongside it for rate-limiting.

## Prerequisites
- A Render account (you can sign up at [render.com](https://render.com)).
- Your code must be pushed to a Git repository (e.g., GitHub, GitLab).

## Deploying using the Blueprint (Automatic Setup)

1. Go to your Render Dashboard.
2. Click **New** -> **Blueprint**.
3. Connect your GitHub/GitLab account and select this repository.
4. Render will automatically detect the `render.yaml` file in the root directory.
5. Review the plan. Render will create:
   - A **Docker Web Service** (`distributed-rate-limiter`) running your application.
   - A **Redis instance** (`rate-limiter-redis`) for rate-limiting.
6. Click **Apply**.
7. Render will build the Docker container (installing NPM dependencies, building React, building the Spring Boot JAR, and starting the application) and boot up the Redis instance.

## Testing Your Live Application

- Once deployed, click on the Web Service's URL in the Render Dashboard (e.g., `https://distributed-rate-limiter-xxxx.onrender.com`).
- The React application will load.
- Any API calls made by the frontend to `/api/data` will automatically be routed to the embedded Spring Boot backend on the same server, ensuring **no CORS issues** arise.
- If you refresh a specific page on your React App, the `ReactAppController` ensures Spring Boot properly forwards 404s to `index.html`, allowing React Router to manage the view seamlessly.

## Manual Docker Build (Local Testing)

If you want to verify the Docker setup locally on your machine before pushing to Render:

1. Ensure Docker is installed on your local machine.
2. Build the Docker image:
   ```bash
   docker build -t rate-limiter-app .
   ```
3. Run the container locally:
   ```bash
   docker run -p 8080:8080 -e PORT=8080 -e REDIS_HOST=host.docker.internal rate-limiter-app
   ```
   *(Note: You will need a local Redis instance running or accessible at `host.docker.internal` for the rate limiter to work correctly).*

4. Navigate to `http://localhost:8080/` in your browser.
