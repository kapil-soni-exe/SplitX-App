import { createGroup, fetchGroups } from "../../api/group.api";

export const useCreateGroup = () => {
  const create = async (name) => {
    try {
      const res = await createGroup({ name });

      const group = res.data.data;

      const inviteLink = `${window.location.origin}/invite/${group.inviteCode}`;

      return {
        group,
        inviteLink,
        message: res.data.message,
      };

    } catch (error) {
      throw error;
    }
  };

  return { create };
};

export const useGroups = () => {
  const getGroups = async () => {
    try {
      const res = await fetchGroups();
      return res.data.data;
    } catch (error) {
      throw error;
    }
  };

  return { getGroups };
};