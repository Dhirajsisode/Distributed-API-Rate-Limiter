import axios from 'axios';

// In development, route requests through our Vite proxy ('/api-proxy') to bypass CORS.
// In production/deployment, the API is hosted from the same domain, so we use a relative URL.
const isDev = import.meta.env.DEV;
const baseURL = isDev ? '/api-proxy' : '';

export const apiClient = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to help capture response times and status
apiClient.interceptors.request.use((config) => {
  // Store start timestamp on config
  (config as any).metadata = { startTime: new Date().getTime() };
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const startTime = (response.config as any).metadata?.startTime;
    if (startTime) {
      const endTime = new Date().getTime();
      (response as any).duration = endTime - startTime;
    }
    return response;
  },
  (error) => {
    const startTime = error.config?.metadata?.startTime;
    if (startTime) {
      const endTime = new Date().getTime();
      error.duration = endTime - startTime;
    }
    return Promise.reject(error);
  }
);
export default apiClient;
