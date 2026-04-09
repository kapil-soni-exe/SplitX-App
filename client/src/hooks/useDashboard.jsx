// hooks/useDashboard.js
import { useEffect, useState, useCallback } from "react";
import { FetchGroupbyId, fetchGroups } from "../../api/group.api";

export function useDashboard() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load group detail (reusable)
  const loadGroup = useCallback(async (groupId) => {
    try {
      setLoading(true);
      const res = await FetchGroupbyId(groupId);
      setGroup(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1️⃣ load groups & auto-select first
  useEffect(() => {
    async function init() {
      try {
        const res = await fetchGroups();
        const list = res.data.data || [];
        setGroups(list);

        if (list.length > 0) {
          setSelectedGroupId(list[0]._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    init();
  }, []);

  // 2️⃣ load selected group detail
  useEffect(() => {
    if (!selectedGroupId) return;
    loadGroup(selectedGroupId);
  }, [selectedGroupId, loadGroup]);

  return {
    groups,
    selectedGroupId,
    setSelectedGroupId,
    group,
    loading,
    error,
    refreshGroup: () => loadGroup(selectedGroupId), // 🔥 NEW
  };
}