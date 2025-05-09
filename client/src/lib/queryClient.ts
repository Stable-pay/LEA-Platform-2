
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
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
  data?: unknown
): Promise<Response> => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }

  return res;
};

export const api = {
  get: (url: string) => apiRequest('GET', url),
  post: (url: string, data: unknown) => apiRequest('POST', url, data),
  put: (url: string, data: unknown) => apiRequest('PUT', url, data),
  delete: (url: string) => apiRequest('DELETE', url),
};

export { queryClient };
export default queryClient;
