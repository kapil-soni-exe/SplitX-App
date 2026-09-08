import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchGroupSettlements,
  createSettlement,
} from "../../api/settlement.api";

export function useGroupSettlement(groupId) {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);

  /* =========================
     Fetch settlement history (React Query)
     - isLoading aliased to "loading" for backward compat
     - enabled guard replaces the old "if (groupId) load()" pattern
  ========================= */

  const { data: history = [], isLoading: loading } = useQuery({
    queryKey: ["settlements", groupId],
    queryFn: async () => {
      const res = await fetchGroupSettlements(groupId);
      return res.data; // backend returns array directly on res.data
    },
    enabled: !!groupId,
  });

  /* =========================
     Create settlement
     - setQueryData for immediate local update (no refetch needed for history list)
     - invalidateQueries on ["group", groupId] to sync netBalance / payList /
       receiveList that ToPay, ToReceive, and GroupSummary depend on
  ========================= */

  const handleCreateSettlement = async (payload) => {
    try {
      setCreating(true);
      const res = await createSettlement(groupId, payload);

      // Add new settlement to top of history cache immediately
      queryClient.setQueryData(["settlements", groupId], (prev = []) => [
        res.data.settlement,
        ...prev,
      ]);

      // Invalidate group detail so netBalance / payList / receiveList recalculate
      // (["group", groupId] is the exact key used in useGroupDetail)
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Settlement failed",
      };
    } finally {
      setCreating(false);
    }
  };

  return {
    history,
    loading,
    creating,
    handleCreateSettlement,
  };
}