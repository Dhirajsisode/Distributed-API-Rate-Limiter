import apiClient from '../api/client';

export const apiService = {
  /**
   * Pings the server root to check general reachability/status.
   */
  async getHealth() {
    const response = await apiClient.get('/');
    return {
      data: response.data,
      status: response.status,
      duration: (response as any).duration || 0,
      headers: response.headers,
    };
  },

  /**
   * Requests /api/data which is rate limited by the Spring Boot filter.
   */
  async getRateLimiterData() {
    try {
      const response = await apiClient.get('/api/data');
      return {
        data: response.data,
        status: response.status,
        duration: (response as any).duration || 0,
        headers: response.headers,
        allowed: true,
      };
    } catch (error: any) {
      if (error.response) {
        return {
          data: error.response.data,
          status: error.response.status,
          duration: error.duration || 0,
          headers: error.response.headers,
          allowed: error.response.status !== 429,
        };
      }
      throw error;
    }
  },

  /**
   * Executes a custom request to the backend with a specified method, path, headers, and body.
   */
  async executeCustomRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    headers: Record<string, string> = {},
    body?: string
  ) {
    // Standardize URL paths
    const url = path.startsWith('/') ? path : `/${path}`;
    
    // Parse JSON body if present
    let parsedBody = undefined;
    if (body && ['POST', 'PUT'].includes(method)) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        parsedBody = body; // Fallback to raw string
      }
    }

    try {
      const response = await apiClient({
        method,
        url,
        headers,
        data: parsedBody,
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText || 'OK',
        duration: (response as any).duration || 0,
        headers: response.headers as Record<string, any>,
        allowed: true,
      };
    } catch (error: any) {
      if (error.response) {
        return {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText || 'Error',
          duration: error.duration || 0,
          headers: error.response.headers as Record<string, any>,
          allowed: error.response.status !== 429,
        };
      }
      return {
        data: error.message || 'Network Error',
        status: 0,
        statusText: 'Offline/Network Error',
        duration: error.duration || 0,
        headers: {},
        allowed: false,
      };
    }
  }
};

export default apiService;
