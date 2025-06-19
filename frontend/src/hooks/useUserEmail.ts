import { useQuery } from "@tanstack/react-query";

export function useUserEmail(userId?: string) {
  return useQuery({
    queryKey: ["user-email", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(`/api/get-user-email?userId=${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching email");
      return data.email;
    },
  });
}