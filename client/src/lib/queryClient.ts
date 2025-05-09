
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

export const apiRequest = axios.create({
  baseURL: '/',
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for handling auth redirects
apiRequest.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && error.response?.data?.redirectTo) {
      window.location.href = error.response.data.redirectTo;
    }
    return Promise.reject(error);
  }
);

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
