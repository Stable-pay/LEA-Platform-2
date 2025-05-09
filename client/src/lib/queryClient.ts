import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const apiRequest = async (method: string, path: string, body?: any) => {
  return fetchApi(path, { method, body: body ? JSON.stringify(body) : undefined });
};

export const getQueryFn = () => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [path] = queryKey;
    return fetchApi(path);
  };
};

export const fetchApi = async (path: string, init?: RequestInit) => {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    credentials: 'include',
  });

  if (response.status === 401) {
    window.location.href = '/auth';
    return null;
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};

export const getQueryFn = () => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [path] = queryKey;
    return fetchApi(path);
  };
};

export default queryClient;

export const api = {
  get: (path: string) => fetchApi(path),
  post: (path: string, body: any) => fetchApi(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: any) => fetchApi(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path: string, body: any) => fetchApi(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => fetchApi(path, { method: 'DELETE' }),
};