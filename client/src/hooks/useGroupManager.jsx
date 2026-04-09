import { useState, useEffect } from "react";
import { useGroups } from "./useCreateGroup";

export function useGroupManager() {
  const { getGroups } = useGroups();

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const fetchGroups = async () => {
    const data = await getGroups();
    setGroups(data);

    if (data.length > 0) {
      setSelectedGroupId((prev) => prev ?? data[0]._id);
    }

    return data;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const selectGroup = (id) => {
    setSelectedGroupId(id);
  };

  const addGroup = async (groupId) => {
    await fetchGroups();
    setSelectedGroupId(groupId);
  };

  const handleGroupLeft = async () => {
    selectGroup(null);
    await fetchGroups();
  };

  return {
    groups,
    selectedGroupId,
    selectGroup,
    addGroup,
    fetchGroups,
    handleGroupLeft
  };
}
