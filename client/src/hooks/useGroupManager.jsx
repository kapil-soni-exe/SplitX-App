import { useEffect, useState } from "react";
import { useGroups } from "./useCreateGroup";

export function useGroupManager() {
  const { getGroups } = useGroups();

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // fetch groups once
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    load();
  }, []);

  // auto select first group
  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0]._id);
    }
  }, [groups]);

  const selectedGroup = groups.find(
    (group) => group._id === selectedGroupId
  );

  // click select
  const selectGroup = (id) => {
    setSelectedGroupId(id);
  };

  // create group
  const addGroup = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
    setSelectedGroupId(newGroup._id);
  };

  return {
    groups,
    selectedGroup,
    selectedGroupId,
    selectGroup,
    addGroup,
    setGroups, // optional
  };
}
