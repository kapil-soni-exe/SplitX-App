import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroups as fetchGroupsApi } from "../../api/group.api";

export function useGroupManager() {
  const queryClient = useQueryClient();

  // UI-only state — not part of server cache
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  /* =========================
     Fetch groups (React Query)
     - No placeholderData here: groups list should always be fresh
       (stale group names/counts in sidebar would be confusing)
  ========================= */

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await fetchGroupsApi();
      return res.data.data;
    },
  });

  /* =========================
     Auto-select first group when list loads and nothing is selected
     (v5 onSuccess is deprecated — useEffect is the correct pattern)
  ========================= */

  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0]._id);
    }
  }, [groups, selectedGroupId]);

  /* =========================
     selectGroup — pure UI state update
  ========================= */

  const selectGroup = (id) => setSelectedGroupId(id);

  /* =========================
     addGroup — called after creating/joining a group.
     Invalidates cache so fresh list is fetched, then selects new group.
     Note: InviteCheck.jsx passes full group object instead of ID —
     handled safely by extracting _id when an object is received.
  ========================= */

  const addGroup = async (groupOrId) => {
    await queryClient.invalidateQueries({ queryKey: ["groups"] });
    const id =
      groupOrId && typeof groupOrId === "object"
        ? groupOrId._id
        : groupOrId;
    setSelectedGroupId(id);
  };

  /* =========================
     handleGroupLeft — clear selection, invalidate list.
     Auto-select useEffect will pick first group once fresh list arrives.
  ========================= */

  const handleGroupLeft = async () => {
    setSelectedGroupId(null);
    await queryClient.invalidateQueries({ queryKey: ["groups"] });
  };

  /* =========================
     fetchGroups — kept for backward compatibility with any consumer
     that calls refreshGroup() / fetchGroups() directly.
     Now delegates to invalidateQueries instead of manual setState.
  ========================= */

  const fetchGroups = async () => {
    await queryClient.invalidateQueries({ queryKey: ["groups"] });
  };

  return {
    groups,
    selectedGroupId,
    selectGroup,
    addGroup,
    fetchGroups,
    handleGroupLeft,
    isLoading,
  };
}
