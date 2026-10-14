import { QueryClient } from '@tanstack/react-query';

// TanStack Query Client with optimal default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
      gcTime: 1000 * 60 * 30,   // 30 minutes garbage collection
      refetchOnWindowFocus: false, // Don't aggressively refetch on tab switch
      retry: 1, // Retry failed queries once
    },
  },
});
