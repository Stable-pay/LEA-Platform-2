import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: false
    }
  }
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const getQueryFn = ({ on401 = "throw" } = {}) => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [url] = queryKey;
    const res = await fetch(url, {
      credentials: 'include'
    });
    
    if (res.status === 401 && on401 === "returnNull") {
      return null;
    }
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    return res.json();
  };
};

export const apiRequest = async (
  method: string,
  url: string,
  body?: any
) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res;
};

export const api = {
  get: (url: string) => apiRequest('GET', url),
  post: (url: string, body: any) => apiRequest('POST', url, body),
  put: (url: string, body: any) => apiRequest('PUT', url, body),
  patch: (url: string, body: any) => apiRequest('PATCH', url, body),
  delete: (url: string) => apiRequest('DELETE', url),
};