import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Create base axios instance
export const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://0.0.0.0:5000",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptors
apiRequest.interceptors.response.use(
  response => response,
  error => {
    // Handle auth errors
    if (error.response?.status === 401) {
      if (error.response?.data?.redirectTo) {
        window.location.href = error.response.data.redirectTo;
      }
    }
    return Promise.reject(error);
  }
);

// Configure Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

// Type for query function options
type QueryFnOptions = {
  on401?: 'throw' | 'returnNull';
};

// Create reusable query function
export const getQueryFn = (options: QueryFnOptions = {}) => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    try {
      const [url] = queryKey;
      const response = await apiRequest.get(url);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 && options.on401 === 'returnNull') {
        return null;
      }
      throw error;
    }
  };
};