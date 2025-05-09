
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

export const apiRequest = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

type QueryFnOptions = {
  on401?: 'throw' | 'returnNull';
};

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
