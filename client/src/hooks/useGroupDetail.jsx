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

  /**
   * Instantly remove a member from the cached group members array
   * when a member-left socket event fires (no API refetch needed).
   */
  const removeMemberLocal = (userId) => {
    queryClient.setQueryData(["group", groupId], (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: prev.members.filter(
          (m) => (m.userId?._id || m.userId)?.toString() !== userId?.toString()
        ),
      };
    });
  };

  /**
   * Instantly add a new member to the cached group members array
   * when a member-joined socket event fires.
   */
  const addMemberLocal = (user) => {
    queryClient.setQueryData(["group", groupId], (prev) => {
      if (!prev) return prev;
      const alreadyExists = prev.members.some(
        (m) => (m.userId?._id || m.userId)?.toString() === user._id?.toString()
      );
      if (alreadyExists) return prev;
      return {
        ...prev,
        members: [...prev.members, { userId: user, joinedAt: new Date() }],
      };
    });
  };

  return {
    group: data,
    loading: isLoading,
    isRefetching: isFetching && !isLoading,
    error,
    updateAdminLocal,
    removeMemberLocal,
    addMemberLocal,
    refetch,
  };
}