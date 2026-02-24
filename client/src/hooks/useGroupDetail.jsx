import { useEffect, useState } from "react";
import { FetchGroupbyId } from "../../api/group.api";

export function useGroupDetail(groupId) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) return;

    const loadGroup = async () => {
      try {
        setLoading(true);
        const res = await FetchGroupbyId(groupId);
        setGroup(res.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId]);

  return { group, loading, error };
}