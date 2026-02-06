import { createGroup,fetchGroups } from "../../api/group.api";
export const useCreateGroup = () => {
  const create = async (name, userId) => {
    const res = await createGroup({ name, userId });

    const group = res.data.data;

    const inviteLink = `${window.location.origin}/join/${group.inviteCode}`;

    return {
      group,
      inviteLink,
    };
  };

  return { create };
};

export const useGroups = () => {
  const getGroups = async () => {
    const res = await fetchGroups();
    return res.data.data;
  };

  return { getGroups };
};