
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const apiRequest = async (method: string, path: string, body?: any) => {
  const response = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  if (response.status === 401) {
    throw new Error('Unauthorized - Please login');
  }

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
};

export const getQueryFn = ({ on401 = "throw" } = {}) => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [path] = queryKey;
    const response = await fetch(`/api${path}`, {
      credentials: 'include'
    });

    if (response.status === 401 && on401 === "returnNull") {
      return null;
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  };
};

export const api = {
  get: (path: string) => apiRequest('GET', path),
  post: (path: string, body: any) => apiRequest('POST', path, body),
  put: (path: string, body: any) => apiRequest('PUT', path, body),
  patch: (path: string, body: any) => apiRequest('PATCH', path, body),
  delete: (path: string) => apiRequest('DELETE', path),
};
