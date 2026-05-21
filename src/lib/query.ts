import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { isAxiosError } from "axios";

interface ApiResponse<T> {
  data: T;
}

export function createQueryConfig<T>(
  key: QueryKey,
  fetcher: () => Promise<AxiosResponse<ApiResponse<T>>>,
  options?: Partial<UseQueryOptions<T, Error>>,
): UseQueryOptions<T, Error> {
  return {
    queryKey: key,
    queryFn: async () => (await fetcher()).data.data,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options,
  };
}

export function createMutationFn<TData, TVariables = void>(
  fetcher: (vars: TVariables) => Promise<AxiosResponse<ApiResponse<TData>>>,
) {
  return async (vars: TVariables): Promise<TData> =>
    (await fetcher(vars)).data.data;
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error ?? fallback;
  }
  return "Network error. Please try again.";
}
