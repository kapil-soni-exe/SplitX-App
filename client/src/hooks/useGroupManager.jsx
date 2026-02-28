import { useState,useEffect } from "react";
import { useGroups } from "./useCreateGroup";

export function useGroupManager() {
  const { getGroups } = useGroups();

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const fetchGroups = async () => {
    const data = await getGroups();
    setGroups(data);
    if (data.length > 0 && !selectedGroupId) {
    setSelectedGroupId(data[0].id);
  }
    return data;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const selectGroup = (id) => {
    setSelectedGroupId(id);
  };

  // ⭐ ONLY IMPORTANT PART
  const addGroup = async (groupId) => {
    await fetchGroups();
    setSelectedGroupId(groupId); // 👈 AUTO OPEN
    console.log("AUTO OPEN ID:", groupId);
  };

  return {
    groups,
    selectedGroupId,
    selectGroup,
    addGroup,
    fetchGroups,
  };
}