import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchGroupbyId } from "../../api/group.api";

export function useGroupDetail(groupId) {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const res = await FetchGroupbyId(groupId);
      return res.data.data;
    },
    enabled: !!groupId,
    // Show previous group data during group switch instead of flashing a blank/spinner
    placeholderData: (previousData) => previousData,
  });

  /**
   * Locally update the group admin in the React Query cache
   * when an admin-changed socket event fires (no refetch needed).
   */
  const updateAdminLocal = (adminId) => {
    queryClient.setQueryData(["group", groupId], (prev) =>
      prev ? { ...prev, admin: adminId } : prev
    );
  };

  return {
    group: data,
    loading: isLoading,             // true only on first load (no cache), false on group switch
    isRefetching: isFetching && !isLoading, // background re-fetch indicator
    error,
    updateAdminLocal,
    refetch,
  };
}