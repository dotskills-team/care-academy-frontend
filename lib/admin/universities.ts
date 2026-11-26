"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminUniversitiesApi,
  type UniversityListParams,
  type UniversityPayload,
} from "@/lib/api/adminUniversities";

export const universityKeys = {
  all: ["universities"] as const,
  list: (p: UniversityListParams) => ["universities", "list", p] as const,
  // Under "all", so every create, update and delete refreshes it too
  stats: ["universities", "stats"] as const,
};

export const useAdminUniversities = (params: UniversityListParams) =>
  useQuery({
    queryKey: universityKeys.list(params),
    queryFn: ({ signal }) => adminUniversitiesApi.list(params, signal),
    placeholderData: keepPreviousData,
  });

export const useUniversityStats = () =>
  useQuery({ queryKey: universityKeys.stats, queryFn: ({ signal }) => adminUniversitiesApi.stats(signal) });

function useUniversityMutation<TVars, TData>(fn: (vars: TVars) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: universityKeys.all }),
  });
}

export const useCreateUniversity = () =>
  useUniversityMutation(({ payload, imageFile }: { payload: UniversityPayload; imageFile?: File }) =>
    adminUniversitiesApi.create(payload, imageFile),
  );
export const useUpdateUniversity = () =>
  useUniversityMutation(({ id, payload, imageFile }: { id: string; payload: UniversityPayload; imageFile?: File }) =>
    adminUniversitiesApi.update(id, payload, imageFile),
  );
export const useDeleteUniversity = () => useUniversityMutation((id: string) => adminUniversitiesApi.remove(id));
