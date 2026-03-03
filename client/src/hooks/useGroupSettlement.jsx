import { useEffect, useState } from "react";
import {
  fetchGroupSettlements,
  createSettlement,
} from "../../api/settlement.api";

export function useGroupSettlement(groupId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Fetch settlement history
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchGroupSettlements(groupId);
        setHistory(res.data);
      } catch (err) {
        console.error("Settlement fetch error", err);
      } finally {
        setLoading(false);
      }
    }

    if (groupId) load();
  }, [groupId]);

  // Create settlement
  const handleCreateSettlement = async (payload) => {
    try {
      setCreating(true);

      const res = await createSettlement(groupId, payload);

      // Optimistic update (no refetch)
      setHistory((prev) => [res.data.settlement, ...prev]);

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