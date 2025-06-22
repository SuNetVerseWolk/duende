import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useSearch = () => {
  const queryClient = useQueryClient();

  const setSearch = (value: string) => {
    queryClient.setQueryData(["search"], value);
  };

  const getSearch = (): string => {
    return queryClient.getQueryData(["search"]) || "";
  };

  const watchSearch = () => {
    return useQuery({
      queryKey: ["search"],
			queryFn: () => getSearch(),
      initialData: "",
      staleTime: Infinity,
    });
  };

  return { watchSearch, setSearch, getSearch };
};
