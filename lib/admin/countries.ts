"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCountriesApi, type CountryListParams, type CountryPayload } from "@/lib/api/adminCountries";

export const countryKeys = {
  all: ["countries"] as const,
  list: (p: CountryListParams) => ["countries", "list", p] as const,
  // Under "all", so every create, update and delete refreshes it too
  stats: ["countries", "stats"] as const,
};

export const useCountryStats = () =>
  useQuery({ queryKey: countryKeys.stats, queryFn: ({ signal }) => adminCountriesApi.stats(signal) });

export const useAdminCountries = (params: CountryListParams) =>
  useQuery({
    queryKey: countryKeys.list(params),
    queryFn: ({ signal }) => adminCountriesApi.list(params, signal),
    placeholderData: keepPreviousData,
  });

function useCountryMutation<TVars, TData>(fn: (vars: TVars) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: countryKeys.all }),
  });
}

export const useCreateCountry = () =>
  useCountryMutation(({ payload, imageFile }: { payload: CountryPayload; imageFile?: File }) =>
    adminCountriesApi.create(payload, imageFile),
  );
export const useUpdateCountry = () =>
  useCountryMutation(({ id, payload, imageFile }: { id: string; payload: CountryPayload; imageFile?: File }) =>
    adminCountriesApi.update(id, payload, imageFile),
  );
export const useDeleteCountry = () => useCountryMutation((id: string) => adminCountriesApi.remove(id));
